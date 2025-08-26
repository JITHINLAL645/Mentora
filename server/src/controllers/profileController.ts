import { Request, Response,RequestHandler } from "express";
import { User } from "../models/user";
import { uploadToCloudinary } from "../utils/cloudinary";
import fs from "fs";



interface AuthRequest extends Request {
  userId?: string;
}

export const getUserProfile: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ user });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

interface AuthRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

export const updateUserProfile: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const { name, gender, phone, city, street, pincode, dob } = req.body;

    let updateData: any = {
      name,
      gender,
      phone,
      city,
      street,
      pincode,
      dob,
    };

    if (req.file) {
      const upload = await uploadToCloudinary(req.file.path, "users");
      fs.unlinkSync(req.file.path);
      updateData.profileImage = upload.url;
    }

    const updatedUser = await User.findByIdAndUpdate(req.userId, updateData, {
      new: true,
    }).select("-password");

    if (!updatedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({ message: "Profile updated", user: updatedUser });
  } catch (err: any) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};
