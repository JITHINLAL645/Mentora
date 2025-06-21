import userRepository from "../repositories/userRepository";
import authRepository from "../repositories/authRepository";
import bcrypt from "bcryptjs";
import cloudinary from '../utils/cloudinary';
import { v4 as uuidv4 } from 'uuid';

export const loginUser = async (email: string, password: string) => {
  const user = await userRepository.findUserByEmail(email);
  if (!user) throw new Error("User not found");

  if (user.isBlock) throw new Error("You are blocked by admin");

  if (!user.password) throw new Error("Password missing");
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Wrong password");

  return user;
};

export const registerUser = async (userData: any) => {
  const existing = await userRepository.findUserByEmail(userData.email);
  if (existing) {
    if (existing.isBlock) throw new Error("You are blocked by admin");
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = {
    ...userData,
    password: hashedPassword,
  };

  return await userRepository.create(newUser);
};



export const uploadProfileImageService = async (userId: string, imageBuffer: Buffer) => {
  const imageName = `profile_${uuidv4()}`;

  const result = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({
      public_id: imageName,
      folder: 'profile-images',
    }, async (error, result) => {
      if (error) return reject(error);
      resolve(result);
    }).end(imageBuffer);
  });

  const uploadedImage = result as { secure_url: string };
  return await authRepository.updateUserProfileImage(userId, uploadedImage.secure_url); 
};
