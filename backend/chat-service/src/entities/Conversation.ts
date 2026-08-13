import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  OneToMany
} from "typeorm";
import { User } from "./User";
import { Message } from "./Message";

@Entity("conversations")
export class Conversation {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ default: false })
  isGroup!: boolean;

  @Column({ nullable: true })
  name!: string; // Group name if isGroup = true

  @Column({ nullable: true })
  groupAvatar!: string;

  @ManyToMany(() => User, { eager: true })
  @JoinTable({
    name: "conversation_participants",
    joinColumn: { name: "conversationId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "userId", referencedColumnName: "id" }
  })
  participants!: User[];

  @OneToMany(() => Message, (message) => message.conversation)
  messages!: Message[];

  @Column({ type: "text", nullable: true })
  lastMessageContent!: string | null;

  @Column({ type: "datetime", nullable: true })
  lastMessageTime!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
