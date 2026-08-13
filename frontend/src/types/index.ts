export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  statusMessage: string;
  isOnline: boolean;
  lastSeen?: string;
}

export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  DOCUMENT = "document"
}

export enum MessageStatus {
  SENT = "sent",
  DELIVERED = "delivered",
  READ = "read"
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender?: User;
  content: string;
  type: MessageType;
  mediaUrl?: string;
  status: MessageStatus;
  createdAt: string;
}

export interface Conversation {
  id: string;
  isGroup: boolean;
  name?: string;
  groupAvatar?: string;
  participants: User[];
  lastMessageContent?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}
