import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";
import passport from "passport";
import "./config/passport"; 
import logger from "./utils/logger";  



import userRoutes from "./routes/userRoutes";
import adminRoutes from "./routes/adminRoutes";
import mentorRoutes from "./routes/mentorRoutes";
import paymentRoutes from "./routes/paymentRoutes";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow frontend ports
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// Only initialize passport for Google OAuth
app.use(passport.initialize());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Static uploads
app.use("/uploads", express.static(path.resolve("uploads")));

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mentors", mentorRoutes);
app.use("/api/admin/mentors", mentorRoutes);
app.use("/api/payments", paymentRoutes);

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
