import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import cloudinary from "../utils/cloudinary";
import userRepository from "../repositories/userRepository";
import authRepository from "../repositories/authRepository";
import { IUser } from "../models/user";

export class AuthService {
  private userRepo = userRepository;
  private authRepo = authRepository;

  async registerUser(userData: any): Promise<IUser> {
    const existing = await this.userRepo.findUserByEmail(userData.email);
    if (existing) {
      if (existing.isBlock) throw new Error("You are blocked by admin");
      throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      ...userData,
      password: hashedPassword,
    };

    return await this.userRepo.create(newUser);
  }

  async loginUser(email: string, password: string): Promise<IUser> {
    const user = await this.userRepo.findUserByEmail(email);
    if (!user) throw new Error("User not found");
    if (user.isBlock) throw new Error("You are blocked by admin");
    if (!user.password) throw new Error("Password missing");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Wrong password");

    return user;
  }

  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async saveOtp(email: string, otp: string) {
    await this.authRepo.saveOtp(email, otp);
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    return await this.authRepo.verifyOtp(email, otp);
  }

  async uploadProfileImage(userId: string, imageBuffer: Buffer): Promise<IUser | null> {
    const imageName = `profile_${uuidv4()}`;

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { public_id: imageName, folder: "profile_pics" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as { secure_url: string });
          }
        )
        .end(imageBuffer);
    });

    return await this.authRepo.updateUserProfileImage(userId, result.secure_url);
  }
}

export default new AuthService();
