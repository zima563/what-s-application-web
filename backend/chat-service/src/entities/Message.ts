import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { User } from "./User";
import { Conversation } from "./Conversation";

export enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read"
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  DOCUMENT = "document"
}

@Entity("messages")
export class Message {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, { onDelete: "CASCADE" })
  @JoinColumn({ name: "conversationId" })
  conversation!: Conversation;

  @Column()
  conversationId!: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: "senderId" })
  sender!: User;

  @Column()
  senderId!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ default: MessageType.TEXT })
  type!: MessageType;

  @Column({ nullable: true })
  mediaUrl!: string;

  @Column({ default: MessageStatus.SENT })
  status!: MessageStatus;

  @CreateDateColumn()
  createdAt!: Date;
}
