import { Router } from "express";
import { getNotifications, markRead, markAllRead, createNotification } from "../controllers/notificationController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.use(protect);

router.get("/", getNotifications);
router.post("/", createNotification);
router.put("/read-all", markAllRead);
router.put("/:id/read", markRead);

export default router;
