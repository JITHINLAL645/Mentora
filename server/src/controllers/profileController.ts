import { Request, Response } from "express";
import { User } from "../models/user";
import { uploadToCloudinary } from "../utils/cloudinary";
import fs from "fs";
import bcrypt from "bcryptjs";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";
import logger from "../utils/logger";
import { sendEmail } from "../utils/sendEmail";

interface AuthRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

const otpStore: { [email: string]: string } = {};

class ProfileController {
  // GET Profile
  public getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.userId).select("-password");
      if (!user) {
        res.status(HttpStatus.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json({
        message: Messages.FETCH_SUCCESS,
        user,
      });
    } catch (err) {
      logger.error("Get Profile Error:", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.GENERAL_ERROR });
    }
  };

  // UPDATE Profile
  public updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, gender, phone, city, street, pincode, dob, about } = req.body;
const updateData: any = {};
if (name) updateData.name = name;
if (gender) updateData.gender = gender; 
if (phone) updateData.phone = phone;
if (city) updateData.city = city;
if (street) updateData.street = street;
if (pincode) updateData.pincode = pincode;
if (dob) updateData.dob = dob;
if (about) updateData.about = about;

      if (req.file) {
        const upload = await uploadToCloudinary(req.file.path, "users");
        fs.unlinkSync(req.file.path);
        updateData.profileImage = upload.url;
      }

      const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
        new: true,
      }).select("-password");

      if (!updatedUser) {
        res.status(HttpStatus.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json({
        message: Messages.PROFILE_UPDATE_SUCCESS,
        user: updatedUser,
      });
    } catch (err: any) {
      logger.error("Update Profile Error:", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message || Messages.GENERAL_ERROR,
      });
    }
  };

// CHANGE PASSWORD 
public changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!req.userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });
    }

    if (!user.password) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Social login user has no password" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(
      req.userId,
      { password: hashedPassword },
      { new: true, runValidators: false } 
    );


    res.status(HttpStatus.OK).json({ message: "Password changed successfully" });
  } catch (err: any) {
    logger.error("Change Password Error:", err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: err.message || Messages.GENERAL_ERROR,
    });
  }
};


  // SEND OTP for Email Change
  public sendOtp = async (req: AuthRequest, res: Response) => {
    try {
      const { email } = req.body;
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      otpStore[email] = otp;
          console.log("📩 Generated OTP for:", email, " → ", otp);


      await sendEmail(email, "OTP Verification", `Your OTP is ${otp}`);

      res.status(HttpStatus.OK).json({ message: "OTP sent successfully" });
    } catch (err) {
      logger.error("Send OTP Error:", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.GENERAL_ERROR });
    }
  };

  // VERIFY OTP
  public verifyOtp = async (req: AuthRequest, res: Response) => {
    try {
      const { email, otp } = req.body;
      if (otpStore[email] !== otp) return res.status(HttpStatus.BAD_REQUEST).json({ message: "Invalid OTP" });

      res.status(HttpStatus.OK).json({ message: "OTP verified successfully" });
    } catch (err) {
      logger.error("Verify OTP Error:", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.GENERAL_ERROR });
    }
  };

  // CHANGE EMAIL
 // CHANGE EMAIL - FINAL FIXED VERSION
public changeEmail = async (req: AuthRequest, res: Response) => {
  try {
    const { oldEmail, newEmail } = req.body;

    if (!req.userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: Messages.USER_NOT_FOUND });
    }

    if (user.email !== oldEmail) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: "Current email does not match" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { $set: { email: newEmail } },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(HttpStatus.OK).json({
      message: "Email updated successfully",
      user: updatedUser,
    });
  } catch (err: any) {
    logger.error("Change Email Error:", err);
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: err.message || Messages.GENERAL_ERROR,
    });
  }
};
}

export const profileController = new ProfileController();
