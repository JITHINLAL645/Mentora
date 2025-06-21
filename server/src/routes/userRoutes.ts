import express from "express";
import * as UserController from "../controllers/authController";
import { upload } from '../middlewares/upload';
import { uploadProfileImage } from '../controllers/profileController';
import { updateUserProfile } from '../controllers/profileController';
import { verifyOtp, resendOtp } from '../controllers/authController';
// import * as menteesController from "../controllers/menteesController";


import { authenticate } from '../middlewares/auth'; // Ensure JWT middleware

const router = express.Router();

router.post("/signup", UserController.register);
router.post("/login", UserController.login);
router.post("/logout/:userId", UserController.logoutUser);
router.post('/upload-profile', upload.single('image'), uploadProfileImage);
router.patch('/profile', authenticate, updateUserProfile);

router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);

// router.get("/mentees", menteesController.getMentees);



export default router;
