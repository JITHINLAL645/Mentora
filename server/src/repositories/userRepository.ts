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

  async getAllMentees(): Promise<IUser[]> {
    return await User.find({ isAdmin: false });
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
