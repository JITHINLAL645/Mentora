import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth"; 
import { User } from "../models/user";

export const isAdmin = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.userId) {
    return res.status(401).json({ message: "Unauthorized. User not found." });
  }

  const user = await User.findById(req.userId);
  if (!user || !user.isAdmin) {
    return res.status(403).json({ message: "Forbidden. Admins only." });
  }

  next();
};
