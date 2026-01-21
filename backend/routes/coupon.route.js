import express from 'express';
import { protectRoute} from '../middleware/auth.middleware.js';
import { getCoupon, validateCoupon, createLivestreamCoupon } from '../controllers/coupon.controller.js';
const router = express.Router();

router.get("/",protectRoute, getCoupon);
router.post("/validate", protectRoute, validateCoupon); // Endpoint to validate coupon
router.post("/livestream-gift", protectRoute, createLivestreamCoupon);

export default router;