import express from "express";
import passport from "passport";
import { authController } from "../di/container";
import { profileController } from "../controllers/profileController";
import { userUpload } from "../middlewares/multer";
import { ensureAuthenticated } from "../middlewares/auth";
import { bookingController } from "../di/container";


import jwt from "jsonwebtoken"; 


const router = express.Router();

const generateToken = (user: any) => {
  return jwt.sign(
    { id: user._id, email: user.email, name: user.name, isAdmin: user.isAdmin || false },
    process.env.JWT_SECRET || "your_jwt_secret",
    { expiresIn: "2h" }
  );
};

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/login",
    session: false, 
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
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(`http://localhost:5173?token=${token}`);
    } catch (error) {
      console.error("Google callback error:", error);
      res.redirect("http://localhost:5173/login");
    }
  }
);

router.post("/signup", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/verify-otp", authController.verifyOtp);
router.post("/resend-otp", authController.resendOtp);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.post("/logout", authController.logoutUser);

router.put("/change-password", ensureAuthenticated, profileController.changePassword);

// CHANGE EMAIL
router.post("/email/send-otp", ensureAuthenticated, profileController.sendOtp);
router.post("/email/verify-otp", ensureAuthenticated, profileController.verifyOtp);
router.put("/email/change", ensureAuthenticated, profileController.changeEmail);



router.get("/profile", ensureAuthenticated, profileController.getUserProfile);
router.put("/profile", ensureAuthenticated, userUpload, profileController.updateUserProfile);

router.get(
  "/my-sessions",
  ensureAuthenticated,
  bookingController.getMySessions.bind(bookingController)
);



router.get("/user", ensureAuthenticated, (req, res) => {
  res.json(req.user);
});

export default router;
