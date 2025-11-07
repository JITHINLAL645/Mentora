import { User, IUser } from "../models/user";
import { BaseRepository } from "./baseRepository";

class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async markVerified(email: string): Promise<void> {
    await User.updateOne({ email }, { isVerified: true });
  }

   async getAllMentees(page: number, limit: number, search?: string): Promise<{ users: IUser[]; total: number }> {
  const skip = (page - 1) * limit;

  // 🔍 build dynamic filter
  const filter: any = { isAdmin: false };

  if (search && search.trim() !== "") {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .skip(skip)
    .limit(limit)
    .select("-password");

  return { users, total };
}

  async updatePassword(email: string, hashedPassword: string): Promise<void> {
    await User.updateOne({ email }, { password: hashedPassword });
  }

  async toggleBlock(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId);
    if (!user) return null;
    user.isBlock = !user.isBlock;
    return await user.save();
  }
  
}

const userRepository = new UserRepository();
export default userRepository;
