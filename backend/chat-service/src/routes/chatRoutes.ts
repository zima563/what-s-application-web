import { Router } from "express";
import { getConversations, createConversation, getMessages, sendMessage, markAsRead } from "../controllers/chatController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.use(protect);

router.get("/conversations", getConversations);
router.post("/conversations", createConversation);
router.get("/messages/:conversationId", getMessages);
router.post("/messages", sendMessage);
router.put("/messages/:conversationId/read", markAsRead);

export default router;
