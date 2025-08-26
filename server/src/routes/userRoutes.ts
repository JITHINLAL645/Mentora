import express from 'express';
import passport from 'passport';
import * as UserController from '../controllers/authController';
import { upload } from '../middlewares/upload';
import {  updateUserProfile, getUserProfile } from '../controllers/profileController';
import { userUpload } from "../middlewares/multer";
import { verifyOtp, resendOtp } from '../controllers/authController';
import { ensureAuthenticated  } from '../middlewares/auth';
import * as authController from '../controllers/authController';

const router = express.Router();

//  Google OAuth Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: 'http://localhost:5173/login',
    successRedirect: 'http://localhost:5173/',
  })
);

//  Get authenticated user
router.get("/user", ensureAuthenticated , (req, res) => {
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
