import Video from "../models/video.model.js";
export const getVideoByUserId = async (req, res) => {
  try {
    const userId = req.user._id;
    const videos = await Video.find({ userId }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy video", error });
  }
};

export const deleteVideoById = async (req, res) => {
  try {
    const { id } = req.params;
   await Video.findByIdAndDelete(id);

    res.json({message:"Đã xóa video"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const fetchVideo = async (req, res) => {
 try {
    const videos = await Video.find();
    if (!videos) return res.status(404).json({ message: "Video not found" });
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}