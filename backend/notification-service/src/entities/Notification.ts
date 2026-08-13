import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

export enum NotificationType {
  NEW_MESSAGE = "new_message",
  GROUP_INVITE = "group_invite",
  SYSTEM_ALERT = "system_alert"
}

@Entity("notifications")
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  userId!: string;

  @Column({ default: NotificationType.NEW_MESSAGE })
  type!: NotificationType;

  @Column()
  title!: string;

  @Column({ type: "text" })
  message!: string;

  @Column({ default: false })
  isRead!: boolean;

  @Column({ nullable: true })
  link!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
