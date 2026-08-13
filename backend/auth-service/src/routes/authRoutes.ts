import { Router } from "express";
import { register, login, getMe, searchUsers, updateProfile, getAllUsers } from "../controllers/authController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.get("/search", protect, searchUsers);
router.get("/users", protect, getAllUsers);
router.put("/profile", protect, updateProfile);

export default router;
