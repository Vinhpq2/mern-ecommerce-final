import express from "express";
import multer from "multer";
import Video from "../models/video.model.js";
import  cloudinary from "../lib/cloudinary.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });// lưu tạm trong memory

// 📌 API tạo video mới
router.post("/add", upload.single("video"), async (req, res) => {
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




// GET /api/video/
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 }); // mới nhất trước
    res.status(200).json({ videos });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/video/user/:userId
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const videos = await Video.find({ userId }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id).populate("userId", "name email");
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
