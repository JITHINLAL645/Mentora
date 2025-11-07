import { User } from "../models/user";
import { IDashboardService } from "../interfaces/IDashboardService";

export class DashboardService implements IDashboardService {
  async getUserStats() {
    const totalMentees = await User.countDocuments({ isAdmin: false });
    const blockedMentees = await User.countDocuments({ isAdmin: false, isBlock: true });
    const totalMentors = await User.countDocuments({ isAdmin: false, isMentor: true });

    return { totalMentees, blockedMentees, totalMentors };
  }
}
