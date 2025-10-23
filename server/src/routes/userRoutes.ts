import express from 'express';
import passport from 'passport';
import * as UserController from '../controllers/authController';
import { updateUserProfile, getUserProfile } from '../controllers/profileController';
import { userUpload } from "../middlewares/multer";
import { verifyOtp, resendOtp } from '../controllers/authController';
import { ensureAuthenticated } from '../middlewares/auth';
import * as authController from '../controllers/authController';
import jwt from 'jsonwebtoken';   

const router = express.Router();

//  Helper: Generate JWT
const generateToken = (user: any) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin || false,
    },
    process.env.JWT_SECRET || "your_jwt_secret", 
    { expiresIn: "7d" }
  );
};

//  Google OAuth Login
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

//  Google OAuth Callback
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/login' }),
  (req: any, res) => {
    try {
      //  Generate JWT token
      const token = generateToken(req.user);

      //  Redirect to frontend with token in query
      res.redirect(`http://localhost:5173?token=${token}`);
    } catch (err) {
      console.error("Google callback error:", err);
      res.redirect('http://localhost:5173/login');
    }
  }
);

//  Get authenticated user (for Google / normal login)
router.get("/user", ensureAuthenticated, (req, res) => {
  res.json(req.user);
});

//  Auth routes
router.post('/signup', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logoutUser);

router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

router.post('/forgot-password', authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

router.get("/profile", ensureAuthenticated, getUserProfile);
router.put("/profile", ensureAuthenticated, userUpload, updateUserProfile);

export default router;
