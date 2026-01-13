import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Send, MessageSquare, User } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useParams } from "react-router-dom";

const TestViewer = () => {
  const { id } = useParams(); // Lấy ID từ URL (nếu có)
  const socketRef = useRef<any>(null);
  const [messages, setMessages] = useState<{username: string, text: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isLive, setIsLive] = useState(false);
  const { user } = useUserStore();
  
  // Nếu có ID trên URL thì dùng luôn, không thì để trống
  const [roomId, setRoomId] = useState(id || ""); 
  // Nếu có ID thì coi như đã join (để hiện giao diện chat luôn)
  const [isJoined, setIsJoined] = useState(!!id); 

  useEffect(() => {
    // Kết nối tới server
    socketRef.current = io("https://novel-jamie-be-ecommerce-f1668421.koyeb.app/");

    socketRef.current.on("connect", () => {
      console.log("Viewer connected:", socketRef.current.id);
      
      // Nếu có ID từ URL, tự động join phòng ngay khi kết nối
      if (id) {
        const username = user?.name || `Guest_${Math.floor(Math.random() * 1000)}`;
        socketRef.current.emit("join-room", { roomId: id, username });
      }
    });

    // Lắng nghe tin nhắn
    socketRef.current.on("chat-message", (data: {username: string, text: string}) => {
      setMessages((prev) => [...prev, data]);
    });

    // Lắng nghe trạng thái stream (giả lập)
    socketRef.current.on("stream-started", () => setIsLive(true));
    socketRef.current.on("stream-ended", () => setIsLive(false));

    return () => {
      socketRef.current?.disconnect();
    };
  }, [id, user]); // Thêm dependencies

  // Hàm tham gia phòng
  const handleJoinRoom = () => {
    if (!roomId.trim()) return alert("Vui lòng nhập Room ID (ID của Host)");
    
    const username = user?.name || `Guest_${Math.floor(Math.random() * 1000)}`;
    socketRef.current.emit("join-room", { roomId, username });
    setIsJoined(true);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const username = user?.name || "Guest";
    const msgData = { username, text: chatInput };
    setMessages((prev) => [...prev, msgData]);

    socketRef.current?.emit("send-message", {
      roomId, // Gửi vào phòng đã nhập
      message: chatInput,
      username
    });

    setChatInput("");
  };

  // Giao diện nhập Room ID trước khi vào xem
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Tham gia Livestream</h2>
          <input
            type="text"
            placeholder="Nhập ID của Host (Room ID)"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button onClick={handleJoinRoom} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition">
            Vào Xem
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6 text-blue-400">Đang xem phòng: {roomId}</h1>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Video Player Placeholder */}
        <div className="md:col-span-2 bg-black rounded-xl aspect-video flex items-center justify-center border border-gray-700 shadow-lg">
          {isLive ? (
            <div className="text-center">
              <p className="text-green-500 font-bold text-xl animate-pulse">🔴 Đang phát trực tiếp</p>
              <p className="text-gray-400 text-sm mt-2">(Video sẽ hiển thị tại đây khi tích hợp WebRTC)</p>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <User size={48} className="mx-auto mb-2 opacity-50" />
              <p>Chờ Host bắt đầu livestream...</p>
            </div>
          )}
        </div>

        {/* Chat Box */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 flex flex-col h-[400px] md:h-auto shadow-xl">
          <div className="p-3 border-b border-gray-700 bg-gray-800 rounded-t-xl">
            <h2 className="font-bold flex items-center gap-2 text-sm">
              <MessageSquare size={18} className="text-blue-400" /> 
              Trò chuyện
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-gray-600">
            {messages.map((msg, idx) => (
              <div key={idx} className="bg-gray-700/30 p-2 rounded text-sm">
                <span className={`font-bold ${msg.username === 'Host' ? 'text-purple-400' : 'text-blue-400'}`}>
                  {msg.username}:
                </span>
                <span className="text-gray-300 ml-1">{msg.text}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-2 border-t border-gray-700">
            <div className="flex gap-2">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Chat..."
                className="flex-1 bg-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
              />
              <button type="submit" className="bg-blue-600 p-2 rounded hover:bg-blue-700"><Send size={16} /></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TestViewer;