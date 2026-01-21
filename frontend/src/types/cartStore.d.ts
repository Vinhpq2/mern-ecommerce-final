import { Cart } from "./cart";
import { Coupon } from "./coupon";
// import { Product } from "./product";
export interface CartStore  {
  cart:Cart[];
  coupon: Coupon;
  total: number;
  subtotal: number;
  isCouponApplied: boolean;
  size:string;
  clearCart: () => void;
  getCartItems : () => void
  addToCart: (product: Cart, size: string) => void
  calculateTotals: () => void;
  removeFromCart: (productId: string,size:string) => void;
  updateQuantity: (productId: string, quantity: number, size: string) => void;
  getMyCoupon: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  checkCouponEligibility: () => Promise<void>;
};