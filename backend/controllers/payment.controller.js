import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { stripe } from "../lib/stripe.js";
import dotenv from "dotenv";
dotenv.config();

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // stripe wants u to send in the format of cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		if (couponCode) {
			coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id, isActive: true });
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}
		console.log("Total Amount (in cents):", totalAmount);

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(coupon.discountPercentage),
						},
				  ]
				: [],
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
			},
		});

	
		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			if (session.metadata.couponCode) {
				const coupon = await Coupon.findOne({ code: session.metadata.couponCode });
				if (coupon) {
					// Nếu là coupon livestream (có giới hạn số lượng)
					if (coupon.usageLimit !== null) {
						// Sử dụng $inc để tăng usageCount một cách nguyên tử (Atomic Update)
						// Giúp tránh lỗi Race Condition khi nhiều người thanh toán cùng lúc
						const updatedCoupon = await Coupon.findByIdAndUpdate(
							coupon._id,
							{ $inc: { usageCount: 1 } },
							{ new: true }
						);

						// Nếu đã dùng hết lượt thì mới tắt
						if (updatedCoupon.usageCount >= updatedCoupon.usageLimit) {
							await Coupon.findByIdAndUpdate(coupon._id, { isActive: false });
						}
					} else {
						// Nếu là coupon cá nhân (không có limit) -> Dùng xong tắt luôn
						await Coupon.findByIdAndUpdate(coupon._id, { isActive: false });
					}
				}
			}

			// Lấy thông tin User và giỏ hàng hiện tại để tạo đơn hàng
			// Thay vì lấy từ metadata (bị giới hạn ký tự), ta lấy trực tiếp từ DB
			const user = await User.findById(session.metadata.userId).populate("cartItems.product");
			
			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			const products = user.cartItems
				.filter(item => item.product) // Lọc bỏ sản phẩm null (đã bị xóa khỏi DB)
				.map((item) => ({
					product: item.product._id,
					quantity: item.quantity,
					price: item.product.price, // Lấy giá hiện tại từ DB
					size: item.size || ""
				}));

			const newOrder = new Order({
				user: session.metadata.userId,
				products: products,
				totalAmount: session.amount_total / 100, // convert from cents to dollars,
				stripeSessionId: sessionId,
			});
			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",
	});

	return coupon.id;
}

async function createNewCoupon(userId) {
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	});

	await newCoupon.save();

	return newCoupon;
}
