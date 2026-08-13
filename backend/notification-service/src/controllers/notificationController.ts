import { Response } from "express";
import { NotificationService } from "../services/notificationService";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const notifService = new NotificationService();

export const getNotifications = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const notifications = await notifService.getUserNotifications(userId);
  res.status(200).json({
    status: "success",
    data: { notifications }
  });
});

export const markRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  await notifService.markAsRead(id, userId);
  res.status(200).json({
    status: "success",
    message: "Notification marked as read"
  });
});

export const markAllRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  await notifService.markAllAsRead(userId);
  res.status(200).json({
    status: "success",
    message: "All notifications marked as read"
  });
});

export const createNotification = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { userId, title, message, type, link } = req.body;
  const notification = await notifService.createNotification(userId, title, message, type, link);
  res.status(201).json({
    status: "success",
    data: { notification }
  });
});
