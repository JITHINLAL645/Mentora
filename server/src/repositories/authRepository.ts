import { User, IUser } from '../models/user';
import { BaseRepository } from './baseRepository';

const otpMap = new Map<string, { otp: string; expiresAt: number }>();

export class AuthRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  async saveOtp(email: string, otp: string) {
    otpMap.set(email, { otp, expiresAt: Date.now() + 60000 });
  }

  async verifyOtp(email: string, inputOtp: string) {
    const data = otpMap.get(email);
    if (!data) return false;
    const isValid = data.otp === inputOtp && Date.now() < data.expiresAt;
    if (isValid) otpMap.delete(email);
    return isValid;
  }

  async updateUserProfileImage(userId: string, imageUrl: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, { profileImage: imageUrl }, { new: true });
  }
}

export default new AuthRepository();