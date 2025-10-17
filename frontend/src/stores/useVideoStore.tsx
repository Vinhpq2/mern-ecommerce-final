import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

interface Video {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
}

interface VideoStore {
  videos: Video[];
  addVideo: (formData:FormData) => Promise<void>;
  getVideosByUserId: () => Promise<void>;
  fetchVideo: () => Promise<void>;
  deleteVideo: (id: string) => Promise<void>;
}

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],

  addVideo: async (formData) =>{
    try{
        const res = await axios.post("/video/add", formData, { withCredentials: true });
        set(prev => (
            {videos: [...prev.videos, res.data] }));
    }catch{
        toast.error("Them video that bai");
    }
    
  },
  getVideosByUserId: async () => {
    try{
        const res = await axios.get("/video/userId");
        console.log(res)
        set({ videos: res.data });
    }catch{
        console.log("Lỗi lấy video");
        set({ videos: [] });
    }
    
  },
  fetchVideo: async () => {
    try {
      const response = await axios.get("/video");
      set({ videos: response.data });
    } catch (error) {
      console.error("Error fetching videos:", error);
      set({ videos: [] });
    }
  },

  deleteVideo: async (id) => {
try{
    await axios.delete(`/video/${id}`, { withCredentials: true });
    set((state) => ({
      videos: state.videos.filter((v) => v._id !== id),

    }));
    toast.success("Xóa video thành công");}
    catch{
        toast.error("Xóa video thất bại");
    }
  },
}));
