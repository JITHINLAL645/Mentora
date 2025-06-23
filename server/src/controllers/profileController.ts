import { Request, Response } from 'express';
import cloudinary from '../utils/cloudinary';
import { User } from '../models/user';

interface AuthenticatedRequest extends Request {
  userId?: string;
}


interface AuthenticatedRequest extends Request {
  userId?: string;
}


export const uploadProfileImage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const file = req.file?.path;
    if (!file) return res.status(400).json({ error: "No image uploaded" });

    const result = await cloudinary.uploader.upload(file, {
      folder: "profile_pics",
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { profileImage: result.secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ profileImage: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
};




export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const {
      firstName,
      lastName,
      phoneNumber,
      position,
      location,
      about,
      profileImage, 
    } = req.body;

    const updateFields: any = {
      firstName,
      lastName,
      phoneNumber,
      position,
      location,
      about,
    };

   if (profileImage) {
  updateFields.profileImage = profileImage;
}

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    });

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
