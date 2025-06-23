import express from 'express';
import * as UserController from '../controllers/authController';
import { upload } from '../middlewares/upload';
import { uploadProfileImage, updateUserProfile } from '../controllers/profileController';
import { getUserProfile } from '../controllers/menteesController';
import { verifyOtp, resendOtp } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Auth routes
router.post('/signup', UserController.register);
router.post('/login', UserController.login);
router.post('/logout/:userId', UserController.logoutUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// Profile routes
router.post("/upload-profile", authenticate, upload.single("image"), uploadProfileImage);
router.patch("/profile", authenticate, updateUserProfile);
router.get("/users/:userId/profile", authenticate, getUserProfile);

export default router;