import express from "express";
import multer from "multer";
import Video from "../models/video.model.js";
import  cloudinary from "../lib/cloudinary.js";
import {protectRoute} from "../middleware/auth.middleware.js";
import { fetchVideo,getVideoByUserId, deleteVideoById } from "../controllers/video.controller.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });// lưu tạm trong memory

// 📌 API tạo video mới
router.post("/add", upload.single("video"), async (req, res) => {
  console.log("call add video");
  try {
    const { userId, title, description } = req.body;
    if (!req.file || !userId) {
      return res.status(400).json({ message: "Missing video or userId" });
    }

    // Upload video lên Cloudinary
    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "video" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    const result = await streamUpload(req.file.buffer);

    // Lưu thông tin vào MongoDB
    const newVideo = await Video.create({
      userId,
      title,
      description,
      videoUrl: result.secure_url,
    });

    res.status(201).json({ message: "Video uploaded", video: newVideo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get("/userId",protectRoute,getVideoByUserId);


router.delete("/:id",protectRoute, deleteVideoById);

// GET /api/video/
router.get("/",protectRoute,fetchVideo);

export default router;
