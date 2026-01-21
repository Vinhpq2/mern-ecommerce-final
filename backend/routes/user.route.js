import express from "express";
import { updateUserProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; 

const router = express.Router();

router.put("/profile", protectRoute, updateUserProfile);

export default router;