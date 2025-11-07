import { IUser } from "../models/user";

export interface IAuthRepository {
  saveOtp(email: string, otp: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
  updateUserProfileImage(userId: string, imageUrl: string): Promise<IUser | null>;
}
