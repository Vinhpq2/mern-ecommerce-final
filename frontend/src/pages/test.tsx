import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Send, Users, MessageSquare } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const TestLivestream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<any>(null);
  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState<{username: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const { user } = useUserStore();

  // 1. Kết nối Socket khi component được mount
  useEffect(() => {
    // Lưu ý: Đổi URL này thành địa chỉ server backend thực tế của bạn
    socketRef.current = io("https://novel-jamie-be-ecommerce-f1668421.koyeb.app/");

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server:", socketRef.current.id);
    });

    // Lắng nghe tin nhắn chat từ server
    socketRef.current.on("chat-message", (data: {username: string, text: string}) => {
      setMessages((prev) => [...prev, data]);
    });

    // Lắng nghe số lượng người xem
    socketRef.current.on("viewer-update", (count: number) => {
      setViewerCount(count);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // 2. Hàm bắt đầu Livestream
  const startStream = async () => {
    try {
      // Xin quyền truy cập Camera & Mic
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      
      // Hiển thị video lên màn hình
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Gửi tín hiệu lên server
      socketRef.current?.emit("start-stream", {
        roomId: user?._id, // Dùng ID của user làm ID phòng
        hostName: user?.name || "Host"
      });

      setIsLive(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Không thể truy cập Camera/Mic. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  // 3. Hàm dừng Livestream
  const stopStream = () => {
    // Tắt camera/mic
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Gửi tín hiệu dừng
    socketRef.current?.emit("stop-stream");
    setIsLive(false);
  };

  // 4. Gửi tin nhắn chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const username = user?.name || "Host";
    const msgData = { username, text: chatInput };
    
    // Hiển thị tin nhắn của chính mình ngay lập tức
    setMessages((prev) => [...prev, msgData]);

    // Gửi lên server
    socketRef.current?.emit("send-message", {
      roomId: user?._id, // Gửi vào phòng của chính mình
      message: chatInput,
      username
    });

    setChatInput("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Livestream Host Dashboard</h1>
      
      {/* Hiển thị ID phòng để copy gửi cho người xem */}
      <div className="mb-4 bg-gray-800 p-4 rounded border border-gray-700 text-sm flex flex-col gap-2 items-center">
        <div>Your Room ID: <span className="font-mono text-yellow-400 font-bold">{user?._id || "Loading..."}</span></div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Link chia sẻ:</span>
          <code className="bg-black px-2 py-1 rounded text-green-400 select-all">
            {window.location.origin}/live/{user?._id}
          </code>
        </div>
      </div>
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cột Trái: Video Stream */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-700">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Status */}
            <div className="absolute top-4 left-4 flex gap-2">
              {isLive && (
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold animate-pulse flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  LIVE
                </div>
              )}
              <div className="bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 backdrop-blur-sm">
                <Users size={16} />
                {viewerCount} Viewers
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            {!isLive ? (
              <button
                onClick={startStream}
                className="px-8 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                📡 Bắt đầu Live
              </button>
            ) : (
              <button
                onClick={stopStream}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                ⏹️ Dừng Live
              </button>
            )}
          </div>
        </div>

        {/* Cột Phải: Chat Box */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col h-[500px] lg:h-auto shadow-xl">
          <div className="p-4 border-b border-gray-700 bg-gray-800 rounded-t-xl">
            <h2 className="font-bold flex items-center gap-2 text-lg">
              <MessageSquare size={20} className="text-purple-400" /> 
              Live Chat
            </h2>
          </div>

          {/* Danh sách tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-600">
            {messages.length === 0 && (
              <p className="text-gray-500 text-center text-sm mt-10">Chưa có tin nhắn nào...</p>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className="bg-gray-700/50 p-2 rounded-lg">
                <span className={`font-bold text-sm ${msg.username === 'Host' ? 'text-purple-400' : 'text-blue-400'}`}>
                  {msg.username}:
                </span>
                <span className="text-gray-200 text-sm ml-2 break-words">{msg.text}</span>
              </div>
            ))}
          </div>

          {/* Input Chat */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-700 bg-gray-800 rounded-b-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              />
              <button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 p-2 rounded-lg transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>

      </div>

      <p className="mt-8 text-gray-500 text-sm">
        File này dùng để test tính năng host livestream độc lập. <br/>
        Đảm bảo backend đang chạy tại <code>https://novel-jamie-be-ecommerce-f1668421.koyeb.app/</code>
      </p>
    </div>
  );
};

export default TestLivestream;