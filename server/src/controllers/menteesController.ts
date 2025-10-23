import { Request, Response } from "express";
import menteeService from "../services/menteeService";

export const getMentees = async (req: Request, res: Response) => {
  try {
    const users = await menteeService.getMentees();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch mentees" });
  }
};

export const toggleBlockUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await menteeService.toggleBlockUser(userId);

    res.status(200).json({
      message: `User ${user.isBlock ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error: any) {
    if (error.message === "User not found") {
      res.status(404).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Failed to toggle block status" });
    }
  }
};
