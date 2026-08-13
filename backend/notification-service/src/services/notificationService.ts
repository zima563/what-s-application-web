import { AppDataSource } from "../config/database";
import { Notification, NotificationType } from "../entities/Notification";

export class NotificationService {
  private notifRepo = AppDataSource.getRepository(Notification);

  async getUserNotifications(userId: string) {
    return this.notifRepo.find({
      where: { userId },
      order: { createdAt: "DESC" },
      take: 20
    });
  }

  async createNotification(userId: string, title: string, message: string, type: NotificationType = NotificationType.NEW_MESSAGE, link?: string) {
    const notif = this.notifRepo.create({
      userId,
      title,
      message,
      type,
      link
    });

    return this.notifRepo.save(notif);
  }

  async markAsRead(notificationId: string, userId: string) {
    await this.notifRepo.update({ id: notificationId, userId }, { isRead: true });
    return { success: true };
  }

  async markAllAsRead(userId: string) {
    await this.notifRepo.update({ userId }, { isRead: true });
    return { success: true };
  }
}
