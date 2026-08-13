"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const database_1 = require("../config/database");
const Notification_1 = require("../entities/Notification");
class NotificationService {
    constructor() {
        this.notifRepo = database_1.AppDataSource.getRepository(Notification_1.Notification);
    }
    async getUserNotifications(userId) {
        return this.notifRepo.find({
            where: { userId },
            order: { createdAt: "DESC" },
            take: 20
        });
    }
    async createNotification(userId, title, message, type = Notification_1.NotificationType.NEW_MESSAGE, link) {
        const notif = this.notifRepo.create({
            userId,
            title,
            message,
            type,
            link
        });
        return this.notifRepo.save(notif);
    }
    async markAsRead(notificationId, userId) {
        await this.notifRepo.update({ id: notificationId, userId }, { isRead: true });
        return { success: true };
    }
    async markAllAsRead(userId) {
        await this.notifRepo.update({ userId }, { isRead: true });
        return { success: true };
    }
}
exports.NotificationService = NotificationService;
