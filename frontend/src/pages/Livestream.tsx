import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Send, Users, MessageSquare, Pin, X, Gift, Settings, AlertTriangle, Mic, MicOff } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import {useLanguageStore} from "../stores/useLanguageStore"
import Peer from "peerjs";
import axios from "../lib/axios";

// Fix lỗi "global is not defined" gây trắng màn hình khi dùng PeerJS với Vite
if (typeof global === "undefined") {
  (window as any).global = window;
}

const Livestream = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<any>(null);
  const peerRef = useRef<Peer | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [messages, setMessages] = useState<{username: string, text: string, isHost?: boolean}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [viewerCount, setViewerCount] = useState(0);
  const [pinnedMessage, setPinnedMessage] = useState<{username: string, text: string, isCoupon?: boolean} | null>(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [couponConfig, setCouponConfig] = useState({ discount: 30, limit: 5 });
  const { user } = useUserStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {t} = useLanguageStore();
  const [roomId, setRoomId] = useState<string>(""); // State lưu Room ID random từ Peer

  // 1. Kết nối Socket và PeerJS
  useEffect(() => {
    if (!user) return;

    // Init Socket
    const socket = io(import.meta.env.MODE === "development" ? "http://localhost:5000" : "https://mern-ecommerce-final-production.up.railway.app/");
    socketRef.current = socket;

    // Init Peer (Random ID để tránh lỗi trùng lặp)
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('error', (err) => console.error('❌ PeerJS Host Error:', err));
    peer.on('open', (id) => {
      console.log('✅ Host Peer ID (Room ID):', id);
      setRoomId(id); // Lưu Peer ID làm Room ID
    });

    // Socket Events
    socket.on("connect", () => {
      console.log("✅ Connected to socket server:", socket.id);
    });

    socket.on("get-stream-request", ({ viewerPeerId }: { viewerPeerId: string }) => {
      if (streamRef.current) {
        console.log("📞 Calling viewer:", viewerPeerId);
        peer.call(viewerPeerId, streamRef.current);
      }
    });

    socket.on("chat-message", (data: {username: string, text: string, isHost?: boolean}) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("viewer-update", (count: number) => {
      setViewerCount(count);
    });

    socket.on("update-pinned-message", (msg) => {
      setPinnedMessage(msg);
    });

    return () => {
      socket.disconnect();
      peer.destroy();
    };
  }, [user]);

  // Tự động cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. Hàm bắt đầu Livestream
  const startStream = async () => {
    try {
      // Xin quyền truy cập Camera & Mic
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      streamRef.current = stream;
      setIsMicOn(true);
      
      // Hiển thị video lên màn hình
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Gửi tín hiệu lên server
      socketRef.current?.emit("start-stream", {
        roomId: roomId, // Dùng Peer ID làm ID phòng
        hostName: user?.name || "Host"
      });

      setIsLive(true);
    } catch (error) {
      console.error("Error accessing media devices:", error);
      alert("Không thể truy cập Camera/Mic. Vui lòng kiểm tra quyền truy cập.");
    }
  };

  // 3. Hàm bật/tắt Mic
  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
        setIsMicOn(track.enabled);
      });
    }
  };

  // 4. Hàm dừng Livestream
  const stopStream = () => {
    setShowStopModal(true);
  };

  const confirmStopStream = () => {
    // Tắt camera/mic
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    // Gửi tín hiệu dừng
    socketRef.current?.emit("stop-stream", roomId);
    setIsLive(false);
    setShowStopModal(false);
  };

  // 5. Gửi tin nhắn chat
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const username = user?.name || "Host";
    const msgData = { username, text: chatInput, isHost: true };
    
    // Hiển thị tin nhắn của chính mình ngay lập tức
    setMessages((prev) => [...prev, msgData]);

    // Gửi lên server
    socketRef.current?.emit("send-message", {
      roomId: roomId, // Gửi vào phòng theo Peer ID
      message: chatInput,
      username,
      isHost: true
    });

    setChatInput("");
  };

  // 6. Tạo Coupon và Ghim
  const handleCreateAndPinCoupon = async () => {
    if (!isLive) return alert("Bạn cần bắt đầu Livestream trước!");
    
    // Đóng modal
    setShowCouponModal(false);

    try {
      // Gọi API tạo coupon với tham số tùy chỉnh
      const res = await axios.post("/coupons/livestream-gift", {
        discount: couponConfig.discount,
        limit: couponConfig.limit
      }); 
      const couponCode = res.data.code;
      const discount = res.data.discountPercentage;

      const msgData = {
        username: user?.name || "Host", // Dùng tên thật của Host
        text: `🎁 GIFT CODE: ${couponCode} (Giảm ${discount}% - SL: ${couponConfig.limit})`,
        isCoupon: true,
        isHost: true // Đánh dấu đây là tin nhắn của Host
      };

      // Gửi tin nhắn coupon vào chat
      socketRef.current?.emit("send-message", {
        roomId: roomId,
        message: msgData.text,
        username: msgData.username,
        isHost: true
      });
      setMessages((prev) => [...prev, msgData]);

      // Ghim luôn tin nhắn này
      socketRef.current?.emit("pin-message", { roomId: roomId, message: msgData });

    } catch (error: any) {
      console.error("Lỗi tạo coupon:", error);
      // Hiển thị lỗi chi tiết từ backend nếu có
      alert(error.response?.data?.message || "Không thể tạo mã giảm giá. Hãy kiểm tra lại server.");
    }
  };

  const handleUnpin = () => {
    socketRef.current?.emit("unpin-message", { roomId: roomId });
  };

  return (
    <div className="max-h-screen bg-gray-900 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">Livestream Host Dashboard</h1>
      
      {/* Hiển thị ID phòng để copy gửi cho người xem */}
      <div className="mb-4 bg-gray-800 p-4 rounded border border-gray-700 text-sm flex flex-col gap-2 items-center">
        <div>Your Room ID: <span className="font-mono text-yellow-400 font-bold text-lg">{roomId || "Generating..."}</span></div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400">Link chia sẻ:</span>
          <code className="bg-black px-2 py-1 rounded text-green-400 select-all">
            {window.location.origin}/live/{roomId}
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
                {viewerCount} 
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
                 {t.startLive}
              </button>
            ) : (
              <>
              <button
                onClick={toggleMic}
                className={`px-6 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 ${isMicOn ? 'bg-gray-600 hover:bg-gray-500' : 'bg-red-500 hover:bg-red-600'}`}
                title={isMicOn ? "Tắt Mic" : "Bật Mic"}
              >
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <button
                onClick={stopStream}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-bold text-lg transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                {t.stopLive}
              </button>
              </>
            )}
          </div>
        </div>

        {/* Cột Phải: Chat Box */}
        {/* Xóa lg:h-auto để cố định chiều cao, tránh bị giãn vô tận */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col h-[500px] shadow-xl">
          <div className="p-4 border-b border-gray-700 bg-gray-800 rounded-t-xl">
            <div className="flex justify-between items-center">
              <h2 className="font-bold flex items-center gap-2 text-lg">
                <MessageSquare size={20} className="text-purple-400" /> 
                Live Chat
              </h2>
              <button 
                onClick={() => setShowCouponModal(true)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 transition"
                title="Tạo mã giảm giá"
              >
                <Gift size={14} /> {t.createGift}
              </button>
            </div>
          </div>

          {/* Pinned Message Area */}
          {pinnedMessage && (
            <div className="bg-purple-900/50 p-3 border-b border-purple-500/30 flex justify-between items-start">
              <div>
                <div className="text-xs text-purple-300 font-bold flex items-center gap-1 mb-1"><Pin size={12}/> Đã ghim</div>
                <div className="text-sm font-semibold text-white">{pinnedMessage.text}</div>
              </div>
              <button onClick={handleUnpin} className="text-gray-400 hover:text-white">
                <X size={16} />
              </button>
            </div>
          )}

          {/* Danh sách tin nhắn */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-500">
            {messages.length === 0 && (
              <p className="text-gray-500 text-center text-sm mt-10">Chưa có tin nhắn nào...</p>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} className="bg-gray-700/50 p-2 rounded-lg">
                {/* Kiểm tra isHost để đổi màu thay vì kiểm tra tên */}
                <span className={`font-bold text-sm ${msg.isHost ? 'text-purple-400' : 'text-blue-400'}`}>
                  {msg.username}:
                </span>
                <span className="text-gray-200 text-sm ml-2 break-words">{msg.text}</span>
              </div>
            ))}
            <div ref={messagesEndRef} />
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

      {/* Modal Cấu hình Coupon */}
      {showCouponModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-80 shadow-2xl">
            <h3 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
              <Settings size={20} /> Tạo  Gift Code
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-300 mb-1">Giảm giá (%)</label>
                <input 
                  type="number" 
                  value={couponConfig.discount}
                  onChange={(e) => setCouponConfig({...couponConfig, discount: Number(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 outline-none"
                  min="1" max="100"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-1">Số lượng giới hạn</label>
                <input 
                  type="number" 
                  value={couponConfig.limit}
                  onChange={(e) => setCouponConfig({...couponConfig, limit: Number(e.target.value)})}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-yellow-500 outline-none"
                  min="1"
                />
              </div>
              
              <div className="flex gap-2 mt-6">
                <button onClick={() => setShowCouponModal(false)} className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded text-sm font-bold">Hủy</button>
                <button onClick={handleCreateAndPinCoupon} className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-2 rounded text-sm font-bold text-white">
                  Tạo & Ghim
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác nhận dừng Live */}
      {showStopModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 w-96 shadow-2xl transform transition-all scale-100">
            <h3 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
              <AlertTriangle size={24} /> Dừng Livestream?
            </h3>
            <p className="text-gray-300 mb-6 text-sm leading-relaxed">
              Bạn có chắc chắn muốn kết thúc phiên phát trực tiếp này không? Người xem sẽ bị ngắt kết nối ngay lập tức.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowStopModal(false)} 
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-medium transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={confirmStopStream} 
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-bold shadow-lg shadow-red-900/30 transition-all transform hover:scale-105"
              >
                Dừng ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Livestream;