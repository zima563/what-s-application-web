import { Response, NextFunction } from "express";
import { ChatService } from "../services/chatService";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { createConversationSchema, sendMessageSchema } from "../validations/chatValidation";
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

const chatService = new ChatService();

export const getConversations = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const conversations = await chatService.getUserConversations(userId);
  res.status(200).json({
    status: "success",
    data: { conversations }
  });
});

export const createConversation = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { error, value } = createConversationSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const userId = req.user!.id;
  let conversation;

  if (value.isGroup) {
    conversation = await chatService.createGroupConversation(userId, value.name, value.participantIds || []);
  } else {
    conversation = await chatService.getOrCreateDirectConversation(userId, value.recipientId);
  }

  res.status(201).json({
    status: "success",
    data: { conversation }
  });
});

export const getMessages = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { conversationId } = req.params;
  const messages = await chatService.getConversationMessages(conversationId, userId);
  res.status(200).json({
    status: "success",
    data: { messages }
  });
});

export const sendMessage = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { error, value } = sendMessageSchema.validate(req.body);
  if (error) {
    return next(new AppError(error.details[0].message, 400));
  }

  const userId = req.user!.id;
  const { conversationId, content, type, mediaUrl } = value;
  const { message, conversation } = await chatService.createMessage(userId, conversationId, content, type, mediaUrl);

  res.status(201).json({
    status: "success",
    data: { message, conversation }
  });
});

export const markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const { conversationId } = req.params;
  await chatService.markMessagesAsRead(conversationId, userId);
  res.status(200).json({
    status: "success",
    message: "Messages marked as read"
  });
});
