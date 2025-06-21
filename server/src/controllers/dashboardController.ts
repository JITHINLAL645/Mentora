// dashboardController.ts
import { Request, Response } from "express";
import { User } from "../models/user"; // Ensure consistent casing

export const getUserCount = async (req: Request, res: Response) => {
  try {
    const totalMentees = await User.countDocuments({ isAdmin: false });
    const blockedMentees = await User.countDocuments({ isAdmin: false, isBlock: true });

    res.status(200).json({ totalMentees, blockedMentees });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};
