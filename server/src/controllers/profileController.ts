// src/controllers/uploadController.ts
import { Request, Response } from 'express';
import cloudinary from '../utils/cloudinary';
import {User} from '../models/user'; // Make sure you import your User model

export const uploadProfileImage = async (req: Request, res: Response) => {
  try {
    const file = req.file?.path;

    if (!file) return res.status(400).json({ error: 'No file uploaded' });

    const result = await cloudinary.uploader.upload(file, {
      folder: 'profile_pics',
    });

    // Save `result.secure_url` to database along with user info
    // Example: await User.findByIdAndUpdate(req.user.id, { profilePic: result.secure_url });

    res.status(200).json({ imageUrl: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const updateFields = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      position: req.body.position,
      location: req.body.location,
      about: req.body.about
    };

    const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true });

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
