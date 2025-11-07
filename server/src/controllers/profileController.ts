import { Request, Response } from "express";
import { User } from "../models/user";
import { uploadToCloudinary } from "../utils/cloudinary";
import fs from "fs";
import { HttpStatus } from "../constants/httpStatus";
import { Messages } from "../constants/messages";
import logger from "../utils/logger";


interface AuthRequest extends Request {
  userId?: string;
  file?: Express.Multer.File;
}

class ProfileController {
  // Get User Profile
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
      logger.error(" Get Profile Error:", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: Messages.GENERAL_ERROR });
    }
  };

  // Update User Profile
  public updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, gender, phone, city, street, pincode, dob, about } = req.body;
      const updateData: any = { name, gender, phone, city, street, pincode, dob, about };

      // Handle file upload to Cloudinary
      if (req.file) {
        const upload = await uploadToCloudinary(req.file.path, "users");
        fs.unlinkSync(req.file.path); // delete local temp file
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
      logger.error(" Update Profile Error:", err);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: err.message || Messages.GENERAL_ERROR,
      });
    }
  };
}

export const profileController = new ProfileController();
