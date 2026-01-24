import express from 'express';
import { protectRoute, adminRoute } from '../middleware/auth.middleware.js';
import { getCoupon, validateCoupon, createLivestreamCoupon, getAllCoupons, deleteCoupon } from '../controllers/coupon.controller.js';
const router = express.Router();

router.get("/",protectRoute, getCoupon);
router.get("/all", protectRoute, adminRoute, getAllCoupons);
router.delete("/:id", protectRoute, adminRoute, deleteCoupon);
router.post("/validate", protectRoute, validateCoupon); // Endpoint to validate coupon
router.post("/livestream-gift", protectRoute, createLivestreamCoupon);

export default router;