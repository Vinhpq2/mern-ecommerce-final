import {create} from "zustand";
import axios from "../lib/axios";
import {toast} from "react-hot-toast";
import type {Product} from "../types/product";
import type {CartStore} from "../types/cartStore";
import { useUserStore } from "./useUserStore";

type addCartPayload = {};

export const useCartStore = create<CartStore>((set, get) => ({
    cart:[],
    coupon:null,
    total:0,
    subtotal:0,
	isCouponApplied:false,

	clearCart: async () => {
    const { user } = useUserStore.getState(); // Lấy user từ useUserStore hoặc bất kỳ nguồn nào khác
	console.log("Clearing cart for user:", user?.cartItems);
    if (user) {
        try {
			await axios.delete("/cart/clearUserCart");
			get().getCartItems(); 
			console.log("Cart cleared for user: try", user);
            // set({ cart: [], coupon: null, total: 0, subtotal: 0 }); // Cập nhật trạng thái của cart, coupon, total và subtotal
        } catch (error) {
            console.error(error);
        }
    }
},
    getCartItems: async() =>{
		console.log("Fetching cart items...");
        try{
            const res = await axios.get("/cart");
            set({cart:res.data});
            get().calculateTotals();
        }
        catch{
            set({cart:[]});
        }
    },
	
	addToCart: async (product:Product) => {
		try {
			await axios.post("/cart", { productId: product._id });

			set((prevState): addCartPayload => {
				const existingItem = prevState.cart.find((item) => item?._id === product._id);
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item?._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];
				return { cart:  newCart };
			});
			get().calculateTotals();
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
		if(total>20000)
			get().getMyCoupon();
        set({subtotal,total});
    },

 	removeFromCart: async (productId) => {
		await axios.delete(`/cart`, { data: { productId } });
		set((prevState) => ({ cart: prevState.cart.filter((item) => item._id !== productId) }));
		get().calculateTotals();
	},

	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId);
			return;
		}
		await axios.put(`/cart/${productId}`, { quantity });
		set((prevState) => ({
			cart: prevState.cart.map((item) => (item._id === productId ? { ...item, quantity } : item)),
		}));
		get().calculateTotals();
	},

	getMyCoupon: async () => {
		try {
			const response = await axios.get("/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},
	applyCoupon: async (code) => {
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
}))