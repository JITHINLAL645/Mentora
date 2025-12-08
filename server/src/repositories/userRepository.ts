import { BaseRepository } from "./baseRepository";
import { IUser } from "../models/user";
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserModel } from "../interfaces/IUserModel";

export class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  private readonly userModel: IUserModel;

  constructor(userModel: IUserModel) {
    super(userModel as any);
    this.userModel = userModel;
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await this.userModel.findOne({ email });
  }

  async markVerified(email: string): Promise<void> {
    await this.userModel.updateOne({ email }, { isVerified: true });
  }

  async getAllMentees(page: number, limit: number, search?: string): Promise<{ users: IUser[]; total: number }> {
    const skip = (page - 1) * limit;
    const filter: any = { isAdmin: false };

    if (search && search.trim() !== "") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const total = await (this.userModel as any).countDocuments(filter);
    const users = await (this.userModel as any)
      .find(filter)
      .skip(skip)
      .limit(limit)
      .select("-password");

    return { users, total };
  }

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await this.userModel.updateOne({ email }, { password: hashedPassword });
  }

  async toggleBlock(userId: string): Promise<IUser | null> {
    const user = await (this.userModel as any).findById(userId);
    if (!user) return null;
    user.isBlock = !user.isBlock;
    return await user.save();
  }

  async findUserById(id: string): Promise<IUser | null> {
    return await this.userModel.findById(id);
  }
}
