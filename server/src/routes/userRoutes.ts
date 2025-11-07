import express from "express";
import passport from "passport";
import { authController } from "../di/container"; // Your DI container
import { profileController } from "../controllers/profileController";
import { userUpload } from "../middlewares/multer";
import { ensureAuthenticated } from "../middlewares/auth";
import jwt from "jsonwebtoken"; 


const router = express.Router();

// Helper: Generate short-lived access token for Google OAuth
const generateToken = (user: any) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin || false },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: "15m" }
  );
};

// Google OAuth Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false, // Important! No session
  }),
  (req: any, res) => {
    try {
      const token = generateToken(req.user);

      const refreshToken = jwt.sign(
        { id: req.user._id },
        process.env.JWT_REFRESH_SECRET || "your_refresh_secret",
        { expiresIn: "7d" }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`http://localhost:5173?token=${token}`);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect("http://localhost:5173/login");
    }
  }
);

// Auth Routes
router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken); // refresh token endpoint
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/logout", authController.logoutUser);

// Profile Routes
router.get("/profile", ensureAuthenticated, profileController.getUserProfile);
router.put("/profile", ensureAuthenticated, userUpload, profileController.updateUserProfile);

// Get current user info
router.get("/user", ensureAuthenticated, (req, res) => {
  res.json(req.user);
});

export default router;
