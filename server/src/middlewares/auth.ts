import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { readdirSync } from "fs";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     res.status(401).json({ message: "Unauthorized. Please log in." });
     return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    req.userId = decoded.id;
    next();
  } catch (err) {
     res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};
