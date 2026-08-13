"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotification = exports.markAllRead = exports.markRead = exports.getNotifications = void 0;
const notificationService_1 = require("../services/notificationService");
const asyncHandler_1 = require("../utils/asyncHandler");
const notifService = new notificationService_1.NotificationService();
exports.getNotifications = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const notifications = await notifService.getUserNotifications(userId);
    res.status(200).json({
        status: "success",
        data: { notifications }
    });
});
exports.markRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;
    await notifService.markAsRead(id, userId);
    res.status(200).json({
        status: "success",
        message: "Notification marked as read"
    });
});
exports.markAllRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    await notifService.markAllAsRead(userId);
    res.status(200).json({
        status: "success",
        message: "All notifications marked as read"
    });
});
exports.createNotification = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { userId, title, message, type, link } = req.body;
    const notification = await notifService.createNotification(userId, title, message, type, link);
    res.status(201).json({
        status: "success",
        data: { notification }
    });
});
