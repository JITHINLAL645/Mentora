import { Request, Response } from 'express';
import { User } from '../models/user';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const getMentees = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ isAdmin: false });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mentees' });
  }
};

export const toggleBlockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBlock = !user.isBlock;
    await user.save();

    res.status(200).json({
      message: `User ${user.isBlock ? 'blocked' : 'unblocked'} successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle block status' });
  }
};


