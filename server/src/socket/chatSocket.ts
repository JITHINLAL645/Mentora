import { Server, Socket } from "socket.io";
import { chatRepository } from "../repositories/chatRepository";

interface SendMessagePayload {
  roomId: string;
  senderId: string;
  receiverId: string;
  message: string;
}

export default function chatSocket(io: Server, socket: Socket) {
  // 🔹 Join a chat room
  socket.on("joinRoom", ({ roomId }: { roomId: string }) => {
    if (!roomId) return;
    socket.join(roomId);
    // console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  // 🔹 Send message (SAVE + EMIT)
  socket.on("sendMessage", async (data: SendMessagePayload) => {
    try {
      const { roomId, senderId, receiverId, message } = data;

      // Validation
      if (!roomId || !senderId || !receiverId || !message.trim()) {
        console.log("❌ Invalid message payload:", data);
        return;
      }

      // Save message to DB
      const savedMessage = await chatRepository.create({
        roomId,
        senderId,
        receiverId,
        message,
      });

      // Emit message to everyone in the room
      io.to(roomId).emit("receiveMessage", savedMessage);
    } catch (error) {
      console.error("❌ Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    // console.log(`Socket disconnected: ${socket.id}`);
  });
}
