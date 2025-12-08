import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const ensureAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
     res.status(401).json({ message: "Unauthorized. Token missing." });
     return
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    req.userId = decoded.id;
    return next(); 
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      logger.warn("Access token expired → client must refresh");
       res.status(401).json({
        message: "TOKEN_EXPIRED",
        code: "TOKEN_EXPIRED"
      });
      return
    }
    logger.error("Invalid token:", err.message);
     res.status(401).json({ message: "Invalid token" });
     return
  }
};