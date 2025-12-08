import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import passport from "passport";
import "./config/passport";
import logger from "./utils/logger";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import mentorRoutes from "./routes/mentorRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import slotRoutes from "./routes/slotRoutes";
import chatRoutes from "./routes/chatRoutes";
import bookingRoutes from "./routes/bookingRoutes";


import http from "http";
import { Server } from "socket.io";
import chatSocket from "./socket/chatSocket";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(passport.initialize());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.resolve("uploads")));

app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/admin/mentors", mentorRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/bookings", bookingRoutes);



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

io.on("connection", (socket) => {
  chatSocket(io, socket);
});

server.listen(PORT, () => {
  logger.info(` Server running on http://localhost:${PORT}`);
});
