import { IUser } from "../models/user";

export interface IAuthService {
  registerUser(userData: any): Promise<IUser>;
  loginUser(email: string, password: string): Promise<IUser>;
  generateOtp(): string;
  saveOtp(email: string, otp: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
  uploadProfileImage(userId: string, imageBuffer: Buffer): Promise<IUser | null>;
}
