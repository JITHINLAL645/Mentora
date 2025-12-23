import { io, Socket } from "socket.io-client";

// Create socket instance
export const socket: Socket = io("http://localhost:5000", {
  withCredentials: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  autoConnect: true,
});

// Connection event logging
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
});

socket.on("reconnect", (attemptNumber) => {
  console.log(`✅ Socket reconnected after ${attemptNumber} attempts`);
});

socket.on("reconnect_attempt", (attemptNumber) => {
  console.log(`🔄 Attempting to reconnect (${attemptNumber})...`);
});

socket.on("reconnect_error", (error) => {
  console.error("❌ Socket reconnection error:", error.message);
});

socket.on("reconnect_failed", () => {
  console.error("❌ Socket reconnection failed after all attempts");
});