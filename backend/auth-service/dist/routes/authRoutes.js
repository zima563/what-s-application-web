"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post("/register", authController_1.register);
router.post("/login", authController_1.login);
// Protected routes
router.get("/me", authMiddleware_1.protect, authController_1.getMe);
router.get("/search", authMiddleware_1.protect, authController_1.searchUsers);
router.get("/users", authMiddleware_1.protect, authController_1.getAllUsers);
router.put("/profile", authMiddleware_1.protect, authController_1.updateProfile);
exports.default = router;
