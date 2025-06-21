import { Request, Response } from "express";
import * as UserService from "../services/authService";
import authRepository from "../repositories/authRepository";
import userRepository from "../repositories/userRepository";
import jwt from "jsonwebtoken";

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  const valid = await authRepository.verifyOtp(email, otp);
  if (!valid) return res.status(400).json({ message: 'Invalid or expired OTP' });
  await userRepository.markVerified(email);
  res.status(200).json({ message: 'Email verified' });
};

export const resendOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  const otp = authRepository.generateOtp();
  await authRepository.saveOtp(email, otp);
  console.log(`OTP sent to ${email}: ${otp}`);
  res.status(200).json({ message: 'OTP resent' });
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await UserService.registerUser(req.body);
    const otp = authRepository.generateOtp();
    await authRepository.saveOtp(user.email, otp);
    console.log(`OTP sent to ${user.email}: ${otp}`);
    res.status(201).json({
      message: 'Registered successfully. OTP sent.',
      user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.loginUser(email, password);
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );
    res.status(200).json({ token, isAdmin: user.isAdmin });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

// export const logoutUser = async (req: Request, res: Response) => {
//   try {
//     res.clearCookie("token");
//     req.session?.destroy(() => {
//       return res.status(200).json({ message: "Logged out successfully" });
//     });
//     return res.status(200).json({ message: "Logged out successfully" });
//   } catch (err) {
//     return res.status(500).json({ message: "Logout failed" });
//   }
// };
export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");

    if (req.session) {
      req.session.destroy(() => {
        return res.status(200).json({ message: "Logged out successfully (session)" });
      });
    } else {
      return res.status(200).json({ message: "Logged out successfully" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Logout failed" });
  }
};
