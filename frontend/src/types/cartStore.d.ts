import { Cart } from "./cart";
import { Coupon } from "./coupon";
import { Product } from "./product";
export interface CartStore  {
  cart:Cart[];
  coupon: Coupon;
  total: number;
  subtotal: number;
  isCouponApplied: boolean;
  clearCart: () => void;
  getCartItems : () => void
  addToCart: (product: Product) => void
  calculateTotals: () => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  getMyCoupon: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
};