import { Server, Socket } from "socket.io";
import { chatRepository } from "../repositories/chatRepository";

interface SendMessagePayload {
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
}

export default function chatSocket(io: Server, socket: Socket) {
  console.log(`✅ New socket connection: ${socket.id}`);

  // 🔹 User joins with their ID
  socket.on("joinUser", (userId: string) => {
    if (!userId) return;
    socket.join(`user-${userId}`);
    console.log(`✅ User ${userId} joined their personal room`);
  });

  // 🔹 Join a chat room
  socket.on("joinRoom", ({ roomId }: { roomId: string }) => {
    if (!roomId) {
      console.log("❌ Invalid roomId for joinRoom");
      return;
    }
    
    socket.join(roomId);
    console.log(`✅ Socket ${socket.id} joined room ${roomId}`);
  });

  // 🔹 Send message (SAVE + EMIT)
  socket.on("sendMessage", async (data: SendMessagePayload) => {
    try {
      const { roomId, senderId, receiverId, message } = data;

      // Validation
      if (!roomId || !senderId || !receiverId || !message?.trim()) {
        console.log("❌ Invalid message payload:", data);
        socket.emit("messageError", { error: "Invalid message data" });
        return;
      }

      console.log(`📤 Processing message in room ${roomId} from ${senderId}`);

      // Save message to DB
      const savedMessage = await chatRepository.create({
        roomId,
        senderId,
        receiverId,
        message: message.trim(),
      });

      console.log(`✅ Message saved with ID: ${savedMessage._id}`);

      // Emit message to everyone in the room (including sender)
      io.to(roomId).emit("receiveMessage", savedMessage);
      
      console.log(`📨 Message emitted to room ${roomId}`);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  // 🔹 Typing indicator (optional feature)
  socket.on("typing", ({ roomId, userName }: { roomId: string; userName: string }) => {
    socket.to(roomId).emit("userTyping", { userName });
  });

  socket.on("stopTyping", ({ roomId }: { roomId: string }) => {
    socket.to(roomId).emit("userStoppedTyping");
  });

  // 🔹 Disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
}