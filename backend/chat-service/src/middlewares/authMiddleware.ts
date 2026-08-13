import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not logged in. Please log in to access messages.", 401));
  }

  try {
    const secret = process.env.JWT_SECRET || "supersecretwhatsappkey123";
    const decoded = jwt.verify(token, secret) as { id: string; email: string; username: string };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError("Invalid token or token expired.", 401));
  }
};
