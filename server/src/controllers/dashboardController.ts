import { Request, Response } from "express";
import { User } from "../models/user"; 

export const getUserCount = async (req: Request, res: Response) => {
  try {
    const totalMentees = await User.countDocuments({ isAdmin: false });
    const blockedMentees = await User.countDocuments({ isAdmin: false, isBlock: true });
    const totalMentors = await User.countDocuments({ isAdmin: false, isMentor: true }); 
    // const totalMentors = await User.countDocuments({ specialization: { $exists: true } });



    res.status(200).json({ totalMentees, blockedMentees,totalMentors  });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user data" });
  }
};
