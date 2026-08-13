"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessageSchema = exports.createConversationSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createConversationSchema = joi_1.default.object({
    recipientId: joi_1.default.string().uuid().when("isGroup", {
        is: false,
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional()
    }),
    isGroup: joi_1.default.boolean().optional(),
    name: joi_1.default.string().when("isGroup", {
        is: true,
        then: joi_1.default.required(),
        otherwise: joi_1.default.optional()
    }),
    participantIds: joi_1.default.array().items(joi_1.default.string().uuid()).optional()
});
exports.sendMessageSchema = joi_1.default.object({
    conversationId: joi_1.default.string().uuid().required(),
    content: joi_1.default.string().required().allow(""),
    type: joi_1.default.string().valid("text", "image", "audio", "document").optional(),
    mediaUrl: joi_1.default.string().uri().optional().allow("")
});
