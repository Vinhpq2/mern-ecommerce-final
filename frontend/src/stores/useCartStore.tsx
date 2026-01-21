import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";
import type {CartStore} from "../types/cartStore";
import type {Cart} from "../types/cart";
import { useUserStore } from "./useUserStore";

type addCartPayload = {};

export const useCartStore = create<CartStore>((set, get) => ({
    cart:[],
    coupon:null,
    total:0,
    subtotal:0,
	isCouponApplied:false,
	size:"",
	clearCart: async () => {
    const { user } = useUserStore.getState(); // Lấy user từ useUserStore hoặc bất kỳ nguồn nào khác
    if (user) {
        try {
			await axios.delete("/cart/clearUserCart");
			get().getCartItems(); 
             set({ cart: [], coupon: null, total: 0, subtotal: 0 }); // Cập nhật trạng thái của cart, coupon, total và subtotal
        } catch (error) {
            console.error(error);
        }
    }
},
    getCartItems: async() =>{
        try{
            const res = await axios.get("/cart");
            set({cart:res.data});
            get().calculateTotals();
            get().checkCouponEligibility(); // Kiểm tra ngay khi load giỏ hàng
        }
        catch{
            set({cart:[]});
        }
    },
	
	addToCart: async (product: Cart) => {
		try {
			await axios.post("/cart", { productId: product._id, size: product.size });

			set((prevState): addCartPayload => {
				const existingItem = prevState.cart.find((item) => item._id === product._id && item.size === product.size);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							(item._id === product._id && item.size === product.size) ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart:  newCart };
			});
			get().calculateTotals();
            get().checkCouponEligibility(); // Kiểm tra sau khi thêm sản phẩm
            toast.success("Đã thêm vào giỏ hàng",{id:"add"});
		} catch {
			toast.error("Lỗi thêm sản phẩm",{id:"error"});
		}
	},

    calculateTotals: () =>{
        const {cart,coupon} = get();
        const subtotal = cart.reduce((sum,item) => sum + item.price * item.quantity,0);
        let total = subtotal;
		
        if(coupon){
            const discount = subtotal * (coupon?.discountPercentage /100);
            total = subtotal - discount;
        }
		
        set({subtotal,total});
    },

 	removeFromCart: async (productId, size) => {
		await axios.delete(`/cart`, { data: { productId, size } });
		set((prevState) => ({ cart: prevState.cart.filter((item) => !(item._id === productId && item.size === size)) }));
		get().calculateTotals();
		get().checkCouponEligibility(); // Kiểm tra lại điều kiện coupon sau khi xóa sản phẩm
	},

	updateQuantity: async (productId, quantity, size) => {
		if (quantity === 0) {
			get().removeFromCart(productId, size);
			return;
		}
		await axios.put(`/cart/${productId}`, { quantity, size });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId && item.size === size ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
        get().checkCouponEligibility(); // Kiểm tra sau khi tăng/giảm số lượng
	},

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			console.log("Fetched Coupon Data:", response.data); // Kiểm tra xem backend có trả về gì không
			set({ coupon: response.data });
			get().calculateTotals(); // Quan trọng: Tính lại tổng tiền sau khi có coupon
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
		const { subtotal } = get();
		if (subtotal < 200) {
			toast.error("Đơn hàng phải từ $200 trở lên mới được sử dụng mã giảm giá.");
			return;
		}
		try {
			const response = await axios.post("/coupons/validate", { code });
			set({ coupon: response.data, isCouponApplied: true });
			get().calculateTotals();
			toast.success("Coupon applied successfully");
		} catch {
			toast.error("Failed to apply coupon");
		}
	},
	removeCoupon: () => {
		set({ coupon: null, isCouponApplied: false });
		get().calculateTotals();
		toast.success("Coupon removed");
	},

    checkCouponEligibility: async () => {
        const { subtotal, coupon } = get();
        // Logic: Nếu đơn hàng >= 200 và chưa có coupon thì tự động tạo/lấy
        if (subtotal >= 200 && !coupon) {
            try {
                // 1. Thử lấy coupon hiện có của user
                const response = await axios.get("/coupons");
                if (response.data) {
                    set({ coupon: response.data });
                } else {
                    // 2. Nếu chưa có, tạo mới (Logic tặng quà ngay lập tức)
                    await axios.post("/coupons/livestream-gift", { discount: 10, limit: 1 });
                    toast.success("Chúc mừng! Đơn hàng > $200 được tặng mã giảm giá");
                    // 3. Lấy lại coupon vừa tạo
                    await get().getMyCoupon();
                }
                get().calculateTotals(); // Tính lại tổng tiền sau khi áp dụng coupon
            } catch (error) {
                console.error("Error checking coupon eligibility:", error);
            }
        }

		// Logic mới: Tự động thu hồi coupon nếu tổng tiền giảm xuống dưới $200 (Chống gian lận)
		if (subtotal < 200 && coupon) {
			set({ coupon: null, isCouponApplied: false });
			get().calculateTotals(); // Tính lại tổng tiền (về giá gốc)
			toast.error("Mã giảm giá đã bị hủy do đơn hàng dưới $200");
		}
    },
}))