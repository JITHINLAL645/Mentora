import { Request, Response } from "express";
import * as UserService from "../services/authService";
import authRepository from "../repositories/authRepository";
import userRepository from "../repositories/userRepository";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail";

// ✅ OTP Verification Controller
export const verifyOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  const valid = await authRepository.verifyOtp(email, otp);

  if (!valid) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await userRepository.markVerified(email);

  res.status(200).json({ message: "Email verified successfully" });
};

// ✅ Resend OTP Controller
export const resendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const otp = authRepository.generateOtp();

    await authRepository.saveOtp(email, otp);

    console.log(`🔁 Resent OTP for ${email}: ${otp}`); // ✅ Show OTP in terminal

    await sendEmail(email, "OTP Resent", `Your new OTP is: ${otp}`);

    res.status(200).json({ message: "OTP resent to your email." });
  } catch (err) {
    console.error("❌ Failed to resend OTP:", err);
    res.status(500).json({ message: "Failed to resend OTP. Please try again." });
  }
};

// ✅ Register User and Send OTP
// export const register = async (req: Request, res: Response) => {
//   try {
//     const user = await UserService.registerUser(req.body);
//     const otp = authRepository.generateOtp();

//     await authRepository.saveOtp(user.email, otp);

//     console.log(`✅ OTP for ${user.email}: ${otp}`); // ✅ Terminal log

//     await sendEmail(user.email, "OTP Verification", `Your OTP is: ${otp}`);

//     res.status(201).json({
//       message: "Registered successfully. OTP sent to your email.",
//       user,
//     });
//   } catch (error: any) {
//     console.error("❌ Registration error:", error.message);
//     res.status(400).json({ message: error.message });
//   }
// };
export const register = async (req: Request, res: Response) => {
  try {
    console.log("🟢 Incoming signup request:", req.body); // check incoming data

    const user = await UserService.registerUser(req.body);
    console.log("✅ User created:", user);

    const otp = authRepository.generateOtp();
    await authRepository.saveOtp(user.email, otp);

    console.log(`📩 OTP for ${user.email}: ${otp}`); // log OTP

    await sendEmail(user.email, "OTP Verification", `Your OTP is: ${otp}`);

    res.status(201).json({
      message: "Registered successfully. OTP sent to your email.",
      user,
    });
  } catch (error: any) {
    console.error("❌ Registration Error:", error.message);
    res.status(400).json({ message: error.message });
  }
};


// ✅ Login Controller
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
    console.error("❌ Login failed:", error.message);
    res.status(401).json({ message: error.message });
  }
};

// ✅ Logout Controller
export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");

    if (req.session) {
      req.session.destroy(() => {
        return res.status(200).json({ message: "Logged out successfully (session cleared)" });
      });
    } else {
      res.status(200).json({ message: "Logged out successfully" });
    }
  } catch (err) {
    console.error("❌ Logout error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};
