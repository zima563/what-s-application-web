import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { ChatService } from "../services/chatService";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

const chatService = new ChatService();
const onlineUsers = new Map<string, string>(); // userId -> socketId

export const setupSocketIO = (io: Server) => {
  // Middleware for socket authentication
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];
    if (!token) {
      return next(new Error("Authentication error: Token required"));
    }
    try {
      const secret = process.env.JWT_SECRET || "supersecretwhatsappkey123";
      const decoded = jwt.verify(token, secret) as { id: string; email: string; username: string };
      socket.data.user = decoded;
      next();
    } catch (err) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", async (socket: Socket) => {
    const user = socket.data.user;
    if (!user) return;

    onlineUsers.set(user.id, socket.id);
    console.log(`🔌 [Socket.io] User connected: ${user.username} (${user.id})`);

    // Update user online status in database
    const userRepo = AppDataSource.getRepository(User);
    await userRepo.update({ id: user.id }, { isOnline: true });

    // Join personal room for targeted notifications
    socket.join(`user_${user.id}`);
    io.emit("user_status_change", { userId: user.id, isOnline: true });

    // Handle joining a conversation room
    socket.on("join_conversation", (conversationId: string) => {
      socket.join(`conv_${conversationId}`);
      console.log(`💬 User ${user.username} joined room conv_${conversationId}`);
    });

    // Handle leaving conversation
    socket.on("leave_conversation", (conversationId: string) => {
      socket.leave(`conv_${conversationId}`);
    });

    // Handle sending a message in real-time
    socket.on("send_message", async (data: { conversationId: string; content: string; type?: any; mediaUrl?: string }) => {
      try {
        const { message, conversation } = await chatService.createMessage(
          user.id,
          data.conversationId,
          data.content,
          data.type,
          data.mediaUrl
        );

        // Broadcast to conversation room
        io.to(`conv_${data.conversationId}`).emit("receive_message", message);

        // Notify all participants about updated conversation list
        conversation.participants.forEach((p) => {
          io.to(`user_${p.id}`).emit("conversation_updated", {
            conversationId: conversation.id,
            lastMessage: message,
            senderId: user.id
          });
        });
      } catch (err: any) {
        socket.emit("error", { message: err.message || "Failed to send message" });
      }
    });

    // Typing indicators
    socket.on("typing_start", (data: { conversationId: string }) => {
      socket.to(`conv_${data.conversationId}`).emit("user_typing", {
        conversationId: data.conversationId,
        userId: user.id,
        username: user.username,
        isTyping: true
      });
    });

    socket.on("typing_stop", (data: { conversationId: string }) => {
      socket.to(`conv_${data.conversationId}`).emit("user_typing", {
        conversationId: data.conversationId,
        userId: user.id,
        username: user.username,
        isTyping: false
      });
    });

    // Mark messages read in real-time
    socket.on("mark_read", async (data: { conversationId: string }) => {
      try {
        await chatService.markMessagesAsRead(data.conversationId, user.id);
        io.to(`conv_${data.conversationId}`).emit("messages_read", {
          conversationId: data.conversationId,
          readBy: user.id
        });
      } catch (err) {
        console.error("Error marking messages read:", err);
      }
    });

    // Handle disconnect
    socket.on("disconnect", async () => {
      console.log(`❌ [Socket.io] User disconnected: ${user.username}`);
      onlineUsers.delete(user.id);
      await userRepo.update({ id: user.id }, { isOnline: false, lastSeen: new Date() });
      io.emit("user_status_change", { userId: user.id, isOnline: false, lastSeen: new Date() });
    });
  });
};
