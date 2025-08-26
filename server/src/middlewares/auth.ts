import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const ensureAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) :void=> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     res.status(401).json({ message: "Unauthorized. Token missing." });
     return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id?: string;
      _id?: string;
      userId?: string;
    };

    // support different payload structures
    req.userId = decoded.id || decoded._id || decoded.userId;

    if (!req.userId) {
       res.status(401).json({ message: "Invalid token payload" });
       return
    }

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
     res.status(401).json({ message: "Unauthorized. Invalid token." });
     return
  }
};
