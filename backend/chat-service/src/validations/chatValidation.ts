import Joi from "joi";

export const createConversationSchema = Joi.object({
  recipientId: Joi.string().uuid().when("isGroup", {
    is: false,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  isGroup: Joi.boolean().optional(),
  name: Joi.string().when("isGroup", {
    is: true,
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  participantIds: Joi.array().items(Joi.string().uuid()).optional()
});

export const sendMessageSchema = Joi.object({
  conversationId: Joi.string().uuid().required(),
  content: Joi.string().required().allow(""),
  type: Joi.string().valid("text", "image", "audio", "document").optional(),
  mediaUrl: Joi.string().uri().optional().allow("")
});
