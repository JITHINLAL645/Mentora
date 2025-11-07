import { IUser } from "../models/user";

export interface IUserRepository {
  findUserByEmail(email: string): Promise<IUser | null>;
  create(user: Partial<IUser>): Promise<IUser>;
  markVerified(email: string): Promise<void>;
  updatePassword(email: string, password: string): Promise<void>;
  getAllMentees(
    page: number,
    limit: number,
    search?: string
  ): Promise<{ users: IUser[]; total: number }>;
  toggleBlock(userId: string): Promise<IUser | null>;
}