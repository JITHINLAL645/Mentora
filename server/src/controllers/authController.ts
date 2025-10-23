import { Request, Response, NextFunction, RequestHandler } from "express";
import authService from "../services/authService";
import { sendEmail } from "../utils/sendEmail";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import userRepository from "../repositories/userRepository";

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await authService.registerUser(req.body);

    const otp = authService.generateOtp();
    await authService.saveOtp(user.email, otp);
    req.session.email = user.email;

    console.log("Generated OTP for", user.email, ":", otp);
    await sendEmail(user.email, "OTP Verification", `Your OTP is: ${otp}`);

    res.status(201).json({ message: "Registered successfully. OTP sent to your email.", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await authService.loginUser(email, password);

    req.login(user, (err) => {
      if (err) return next(err);

      const token = generateToken(user._id);
      return res.status(200).json({
        token,
        user: { _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin },
      });
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const verifyOtp: RequestHandler = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const valid = await authService.verifyOtp(email, otp);
    console.log("Verifying OTP for", email, ":", otp);

    if (!valid) return res.status(400).json({ message: "Invalid or expired OTP" });

    await userRepository.markVerified(email);
    const user = await userRepository.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = generateToken(user._id);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      token,
      user: { ...user.toObject(), verified: true },
    });
  } catch (err) {
    next(err);
  }
};

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await userRepository.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = authService.generateOtp();
    await authService.saveOtp(email, otp);

    console.log("Resent OTP:", otp, "to", email);

    await sendEmail(email, "OTP Resent", `Your new OTP is: ${otp}`);

    res.status(200).json({ message: "OTP resent to your email." });
  } catch (err) {
    console.error("Resend OTP error:", err);
    res.status(500).json({ message: "Failed to resend OTP. Please try again." });
  }
};


export const logoutUser = async (req: Request, res: Response) => {
  try {
    req.logout(() => {
      if (req.session) {
        req.session.destroy(() => {
          res.clearCookie("connect.sid");
          return res.status(200).json({ message: "Logged out successfully" });
        });
      } else {
        return res.status(200).json({ message: "Logged out (no active session)" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await userRepository.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = authService.generateOtp();
    
    console.log(`Generated OTP for ${email}: ${otp}`);

    await authService.saveOtp(email, otp);
    await sendEmail(email, "Your OTP", `Your OTP is ${otp}`);

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error: any) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await userRepository.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepository.updatePassword(email, hashedPassword);

    res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Something went wrong while resetting the password" });
  }
};