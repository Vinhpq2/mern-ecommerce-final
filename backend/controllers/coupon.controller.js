import Coupon from "../models/coupon.model.js";

export const getCoupon = async (req, res) => {
	try {
		const coupon = await Coupon.findOne({ userId: req.user._id, isActive: true });
		res.json(coupon || null);
	} catch (error) {
		console.log("Error in getCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		// Tìm coupon theo code và trạng thái active (bỏ điều kiện userId để Viewer có thể dùng mã của Host)
		const coupon = await Coupon.findOne({ code: code, isActive: true });

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		// Nếu coupon là loại riêng tư (không có usageLimit) thì phải check chủ sở hữu
		if (!coupon.usageLimit && coupon.userId && coupon.userId.toString() !== req.user._id.toString()) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		// Kiểm tra giới hạn sử dụng (nếu có)
		if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
			return res.status(400).json({ message: "Coupon usage limit reached" });
		}

		if (coupon.expirationDate < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(404).json({ message: "Coupon expired" });
		}

		res.json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.log("Error in validateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const createLivestreamCoupon = async (req, res) => {
	try {
		const { discount, limit } = req.body; // Nhận tham số tùy chỉnh từ FE
		const userId = req.user._id;
		
		// Xóa coupon cũ của user này nếu có (theo logic bạn yêu cầu)
		await Coupon.findOneAndDelete({ userId });

		const newCoupon = new Coupon({
			code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
			discountPercentage: discount || 30, // Dùng giá trị tùy chỉnh hoặc mặc định 30
			expirationDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Hết hạn sau 1 ngày
			userId: userId,
			usageLimit: limit || 50, // Giới hạn số lần sử dụng (mặc định 50)
			usageCount: 0
		});

		await newCoupon.save();
		res.json(newCoupon);
	} catch (error) {
		console.log("Error in createLivestreamCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
