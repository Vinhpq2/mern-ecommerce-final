import { motion } from "framer-motion";
import { Trash } from "lucide-react";
import { useVideoStore } from "../stores/useVideoStore";
import { useState } from "react";
import { useEffect } from "react";

const VideosList = () => {
  const { videos,getVideosByUserId, deleteVideo} = useVideoStore();
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    getVideosByUserId();
  },[getVideosByUserId]);
  const handleDeleteClick = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (selectedId) deleteVideo(selectedId);
    setShowModal(false);
    setSelectedId(null);
  };


  return (
    <>
      {/* Danh sách video */}
      <motion.div
        className="bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-5xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
         <table className="min-w-full divide-y divide-gray-700">
        {/* ---- Phần tiêu đề bảng ---- */}
        <thead className="bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Tiêu đề
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Mô tả
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Video
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>

        {/* ---- Phần nội dung bảng ---- */}
        <tbody className="bg-gray-800 divide-y divide-gray-700">
          {videos.length > 0 ? (
            videos.map((video) => (
              <tr key={video._id} className="hover:bg-gray-700 transition">
                {/* Tiêu đề */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-200">
                  {video.title || "Không có tiêu đề"}
                </td>

                {/* Mô tả */}
                <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                  {video.description || "Không có mô tả"}
                </td>

                {/* Video Cloudinary */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <video
                    controls
                    className="w-40 h-24 rounded-lg object-cover"
                    src={video.videoUrl}
                  />
                </td>

                {/* Hành động */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleDeleteClick(video._id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={4}
                className="text-center py-6 text-gray-400 italic"
              >
                Chưa có video nào.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </motion.div>

      {/* Modal Xem video */}
      {previewUrl && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          onClick={() => setPreviewUrl(null)}
        >
          <div
            className="bg-gray-900 rounded-lg p-4 shadow-lg max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={previewUrl}
              controls
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Modal xác nhận xóa */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold text-white mb-4">
              Bạn có chắc muốn xóa video này?
            </h2>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideosList;
