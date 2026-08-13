import { AppDataSource } from "../config/database";
import { Conversation } from "../entities/Conversation";
import { Message, MessageStatus, MessageType } from "../entities/Message";
import { User } from "../entities/User";
import { AppError } from "../utils/AppError";

export class ChatService {
  private conversationRepo = AppDataSource.getRepository(Conversation);
  private messageRepo = AppDataSource.getRepository(Message);
  private userRepo = AppDataSource.getRepository(User);

  async getUserConversations(userId: string) {
    const conversations = await this.conversationRepo
      .createQueryBuilder("conv")
      .leftJoinAndSelect("conv.participants", "participant")
      .leftJoinAndSelect("conv.messages", "msg")
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("cp.conversationId")
          .from("conversation_participants", "cp")
          .where("cp.userId = :userId")
          .getQuery();
        return "conv.id IN " + subQuery;
      }, { userId })
      .orderBy("conv.lastMessageTime", "DESC")
      .addOrderBy("conv.updatedAt", "DESC")
      .getMany();

    // Calculate unread count per conversation
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await this.messageRepo
          .createQueryBuilder("m")
          .where("m.conversationId = :convId", { convId: conv.id })
          .andWhere("m.senderId != :userId", { userId })
          .andWhere("m.status != :readStatus", { readStatus: MessageStatus.READ })
          .getCount();

        return {
          ...conv,
          unreadCount
        };
      })
    );

    return result;
  }

  async getOrCreateDirectConversation(userId: string, recipientId: string) {
    if (userId === recipientId) {
      throw new AppError("Cannot create a chat with yourself", 400);
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    const recipient = await this.userRepo.findOne({ where: { id: recipientId } });

    if (!user || !recipient) {
      throw new AppError("User or recipient not found", 404);
    }

    // Check if direct conversation already exists
    const existing = await this.conversationRepo
      .createQueryBuilder("conv")
      .innerJoin("conv.participants", "p1", "p1.id = :userId", { userId })
      .innerJoin("conv.participants", "p2", "p2.id = :recipientId", { recipientId })
      .where("conv.isGroup = false")
      .getOne();

    if (existing) {
      return this.conversationRepo.findOne({
        where: { id: existing.id },
        relations: ["participants"]
      });
    }

    // Create new direct conversation
    const newConv = this.conversationRepo.create({
      isGroup: false,
      participants: [user, recipient]
    });

    await this.conversationRepo.save(newConv);
    return newConv;
  }

  async createGroupConversation(userId: string, name: string, participantIds: string[]) {
    const creator = await this.userRepo.findOne({ where: { id: userId } });
    if (!creator) throw new AppError("Creator user not found", 404);

    const uniqueIds = Array.from(new Set([...participantIds, userId]));
    const participants = await this.userRepo.findByIds(uniqueIds);

    const group = this.conversationRepo.create({
      isGroup: true,
      name,
      groupAvatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=250&q=80",
      participants
    });

    await this.conversationRepo.save(group);
    return group;
  }

  async getConversationMessages(conversationId: string, userId: string) {
    // Check membership
    const conv = await this.conversationRepo
      .createQueryBuilder("conv")
      .leftJoinAndSelect("conv.participants", "p")
      .where("conv.id = :conversationId", { conversationId })
      .getOne();

    if (!conv) {
      throw new AppError("Conversation not found", 404);
    }

    const isParticipant = conv.participants.some((p) => p.id === userId);
    if (!isParticipant) {
      throw new AppError("You are not a member of this conversation", 403);
    }

    const messages = await this.messageRepo.find({
      where: { conversationId },
      order: { createdAt: "ASC" },
      relations: ["sender"]
    });

    return messages;
  }

  async createMessage(senderId: string, conversationId: string, content: string, type: MessageType = MessageType.TEXT, mediaUrl?: string) {
    const conversation = await this.conversationRepo.findOne({
      where: { id: conversationId },
      relations: ["participants"]
    });

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    const message = this.messageRepo.create({
      conversationId,
      senderId,
      content,
      type,
      mediaUrl: mediaUrl || undefined,
      status: MessageStatus.SENT
    });

    await this.messageRepo.save(message);

    // Update conversation last message time
    conversation.lastMessageContent = content;
    conversation.lastMessageTime = message.createdAt;
    await this.conversationRepo.save(conversation);

    const fullMessage = await this.messageRepo.findOne({
      where: { id: message.id },
      relations: ["sender"]
    });

    return { message: fullMessage!, conversation };
  }

  async markMessagesAsRead(conversationId: string, userId: string) {
    await this.messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ status: MessageStatus.READ })
      .where("conversationId = :conversationId", { conversationId })
      .andWhere("senderId != :userId", { userId })
      .andWhere("status != :readStatus", { readStatus: MessageStatus.READ })
      .execute();

    return { success: true };
  }
}
