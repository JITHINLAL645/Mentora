import { IUser } from "../models/user";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;

  create(user: Partial<IUser>): Promise<IUser>;

  markVerified(email: string): Promise<void>;

  updatePassword(email: string, hashedPassword: string): Promise<void>;

  updateEmail(userId: string, newEmail: string): Promise<void>;

  saveOtp(email: string, otp: string): Promise<void>;
  verifyOtp(email: string, otp: string): Promise<boolean>;

  getAllMentees(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ users: IUser[]; total: number }>;

  toggleBlock(userId: string): Promise<IUser | null>;
}
