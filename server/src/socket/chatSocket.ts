import { Server, Socket } from "socket.io";
import { chatRepository } from "../repositories/chatRepository";

export default function chatSocket(io: Server, socket: Socket) {
  // console.log("User connected:", socket.id);

  socket.on("joinRoom", async ({ roomId }) => {
    socket.join(roomId);
    // console.log(`User ${socket.id} joined room ${roomId}`);
  });

 socket.on("sendMessage", async (data) => {
  const { roomId, senderId, receiverId, message } = data;

  if (!roomId || !senderId || !receiverId || !message) {
    console.log(" Missing required fields:", data);
    return;
  }

  const saved = await chatRepository.create({
    roomId,
    senderId,
    receiverId,
    message, 
  });

  io.to(roomId).emit("receiveMessage", saved);
});


  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);
  });
}
