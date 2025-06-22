// server.ts

import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import mentorRoutes from "./routes/mentorRoutes";
import dotenv from "dotenv";

dotenv.config();

connectDB();

const app = express();
const PORT = 5000;

// ✅ Allow multiple frontend origins (e.g., Vite dev servers on 5173 or 5174)
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin like mobile apps or curl
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/admin/mentors", mentorRoutes); 

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
