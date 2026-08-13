import { Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { registerSchema, loginSchema, updateProfileSchema } from "../validations/authValidation";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const authService = new AuthService();

export const register = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { error, value } = registerSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const result = await authService.register(value);
  res.status(201).json({
    status: "success",
    data: result
  });
});

export const login = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const result = await authService.login(value);
  res.status(200).json({
    status: "success",
    data: result
  });
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("Not authenticated", 401));
  }
  const user = await authService.getUserById(req.user.id);
  res.status(200).json({
    status: "success",
    data: { user }
  });
});

export const searchUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const query = (req.query.q as string) || "";
  const currentUserId = req.user!.id;
  const users = await authService.searchUsers(query, currentUserId);
  res.status(200).json({
    status: "success",
    data: { users }
  });
});

export const updateProfile = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { error, value } = updateProfileSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const user = await authService.updateProfile(req.user!.id, value);
  res.status(200).json({
    status: "success",
    data: { user }
  });
});

export const getAllUsers = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const users = await authService.getAllUsers(req.user!.id);
  res.status(200).json({
    status: "success",
    data: { users }
  });
});
