import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String },
  description: { type: String },
  videoUrl: { type: String, required: true }, // lưu link Cloudinary
}, { timestamps: true });

export default mongoose.model("Video", videoSchema);
