"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.sendMessage = exports.getMessages = exports.createConversation = exports.getConversations = void 0;
const chatService_1 = require("../services/chatService");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
const chatValidation_1 = require("../validations/chatValidation");
const chatService = new chatService_1.ChatService();
exports.getConversations = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const conversations = await chatService.getUserConversations(userId);
    res.status(200).json({
        status: "success",
        data: { conversations }
    });
});
exports.createConversation = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { error, value } = chatValidation_1.createConversationSchema.validate(req.body);
    if (error) {
        return next(new AppError_1.AppError(error.details[0].message, 400));
    }
    const userId = req.user.id;
    let conversation;
    if (value.isGroup) {
        conversation = await chatService.createGroupConversation(userId, value.name, value.participantIds || []);
    }
    else {
        conversation = await chatService.getOrCreateDirectConversation(userId, value.recipientId);
    }
    res.status(201).json({
        status: "success",
        data: { conversation }
    });
});
exports.getMessages = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { conversationId } = req.params;
    const messages = await chatService.getConversationMessages(conversationId, userId);
    res.status(200).json({
        status: "success",
        data: { messages }
    });
});
exports.sendMessage = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { error, value } = chatValidation_1.sendMessageSchema.validate(req.body);
    if (error) {
        return next(new AppError_1.AppError(error.details[0].message, 400));
    }
    const userId = req.user.id;
    const { conversationId, content, type, mediaUrl } = value;
    const { message, conversation } = await chatService.createMessage(userId, conversationId, content, type, mediaUrl);
    res.status(201).json({
        status: "success",
        data: { message, conversation }
    });
});
exports.markAsRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const userId = req.user.id;
    const { conversationId } = req.params;
    await chatService.markMessagesAsRead(conversationId, userId);
    res.status(200).json({
        status: "success",
        message: "Messages marked as read"
    });
});
