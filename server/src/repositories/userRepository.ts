
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
}

const userRepository = new UserRepository();
export default userRepository;
