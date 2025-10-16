import { useEffect, useState } from "react";
import axios from "../lib/axios";

type VideoType = {
  _id: string;
  userId: string;
  title: string;
  description: string;
  videoUrl: string;
};

const VideoListPage = () => {
  const [videos, setVideos] = useState<VideoType[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await axios.get("/video/"); // lấy tất cả video
        setVideos(res.data.videos);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="flex flex-wrap gap-4">
      {videos.map((video) => (
        <div key={video._id} className="flex flex-col items-center bg-gray-900 p-2 rounded">
          <video
            src={video.videoUrl}
            controls
            className="w-[300px] h-[200px] mb-2"
          />
          <h3 className="text-white font-bold">{video.title}</h3>
          <p className="text-gray-300">{video.description}</p>
        </div>
      ))}
    </div>
  );
};
export default VideoListPage;