import { Server } from "socket.io";

// Lưu danh sách các phòng đang Live
const activeStreams = new Set();

export const initializeSocket = (httpServer) => {
  console.log("🔌 Initializing Socket.io server...");
  const io = new Server(httpServer, {
    cors: {
      origin: [
        "https://mern-ecommerce-sage-five.vercel.app", // domain FE production
        "http://localhost:5173",                   // domain dev local
        "*" // Cho phép kết nối từ mọi nguồn (hữu ích khi test)
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ New client connected:", socket.id);

    // 1. Host bắt đầu Livestream
    socket.on("start-stream", ({ roomId, hostName }) => {
      socket.join(roomId);
      activeStreams.add(roomId); // Đánh dấu phòng này đang Live
      console.log(`Stream started by ${hostName} in room ${roomId}`);
      socket.to(roomId).emit("stream-started");
    });

    // 2. Viewer tham gia xem
    socket.on("join-room", ({ roomId, username }) => {
      socket.join(roomId);
      console.log(`${username} joined room ${roomId}`);

      // Cập nhật số lượng người xem
      const room = io.sockets.adapter.rooms.get(roomId);
      const viewerCount = room ? room.size : 0;
      io.to(roomId).emit("viewer-update", viewerCount);

      // Nếu phòng này đang Live, báo ngay cho người mới vào biết
      if (activeStreams.has(roomId)) {
        socket.emit("stream-started");
      }
    });

    // 3. Chat
    socket.on("send-message", ({ roomId, message, username, isHost }) => {
      // Gửi cho người khác trong phòng (trừ người gửi)
      socket.to(roomId).emit("chat-message", { username, text: message, isHost });
    });

    // 4. Dừng Livestream
    socket.on("stop-stream", (roomId) => {
      activeStreams.delete(roomId); // Xóa khỏi danh sách Live
      // Chỉ gửi sự kiện dừng cho phòng cụ thể
      socket.to(roomId).emit("stream-ended");
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });

    // 5. Viewer yêu cầu video (gửi PeerID lên) - Logic PeerJS
    socket.on("request-stream", ({ roomId, viewerPeerId }) => {
      // Gửi yêu cầu này tới Host để Host gọi lại truyền video
      socket.to(roomId).emit("get-stream-request", { viewerPeerId });
    });

    // 6. Heartbeat: Host báo cáo vẫn đang live (để xử lý trường hợp server restart)
    socket.on("stream-keepalive", ({ roomId }) => {
      if (!activeStreams.has(roomId)) {
        activeStreams.add(roomId);
        console.log(`Restored stream state for room ${roomId}`);
        socket.to(roomId).emit("stream-started"); // Báo lại cho Viewer biết
      }
    });

    // Log khi có lỗi socket
    socket.on("error", (err) => {
      console.error("❌ Socket error:", err);
    });
  });

  return io;
};