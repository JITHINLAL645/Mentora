import { Request, Response, NextFunction } from "express";
import * as UserService from "../services/authService";
import authRepository from "../repositories/authRepository";
import userRepository from "../repositories/userRepository";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail";
import bcrypt from "bcrypt"; 

// Helper to generate JWT
const generateToken = (userId: string) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );
};

export const register = async (req: Request, res: Response) => {
  try {
    const user = await UserService.registerUser(req.body);

    const otp = authRepository.generateOtp();
    await authRepository.saveOtp(user.email, otp);
        console.log("Generated OTP for", user.email, ":", otp);


    req.session.email = user.email; 

    await sendEmail(user.email, "OTP Verification", `Your OTP is: ${otp}`);

    res.status(201).json({
      message: "Registered successfully. OTP sent to your email.",
      user,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await UserService.loginUser(email, password);

    req.login(user, (err) => {
      if (err) return next(err);

      //  Generate JWT token
      const token = generateToken(user._id);

      return res.status(200).json({
        token,  
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

// export const verifyOtp = async (req: Request, res: Response) => {
//   const { email, otp } = req.body;

//   const valid = await authRepository.verifyOtp(email, otp);
// console.log("Verifying OTP for", email, ":", otp);


//   if (!valid) {
//      res.status(400).json({ message: "Invalid or expired OTP" });
//      return
//   }

//   await userRepository.markVerified(email);
//   const user = await userRepository.findUserByEmail(email);

//   res.status(200).json({ 
//     message: "Email verified successfully", 
//     user: { ...user.toObject(), verified: true } 
//   });
// };


export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const valid = await authRepository.verifyOtp(email, otp);
  console.log("Verifying OTP for", email, ":", otp);

  if (!valid) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Mark user as verified
  await userRepository.markVerified(email);
  const user = await userRepository.findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // ✅ Generate JWT token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: "Email verified successfully",
    token, 
    user: { ...user.toObject(), verified: true },
  });
};


export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const otp = authRepository.generateOtp();

    await authRepository.saveOtp(email, otp);
    await sendEmail(email, "OTP Resent", `Your new OTP is: ${otp}`);

    res.status(200).json({ message: "OTP resent to your email." });
  } catch (err) {
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

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const otp = authRepository.generateOtp();
    await authRepository.saveOtp(email, otp);

    await sendEmail(email, "Your OTP", `Your OTP is ${otp}`);

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error: any) {
    res.status(500).json({ message: "Something went wrong" });
  }
};


export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword } = req.body;

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(500).json({ message: "Something went wrong while resetting the password" });
  }
};

