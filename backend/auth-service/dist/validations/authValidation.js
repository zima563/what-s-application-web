"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(30).required().messages({
        "string.min": "Username must be at least 3 characters",
        "string.max": "Username cannot exceed 30 characters",
        "any.required": "Username is required"
    }),
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required"
    }),
    password: joi_1.default.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required"
    }),
    avatar: joi_1.default.string().uri().allow("", null).optional(),
    statusMessage: joi_1.default.string().max(100).allow("", null).optional()
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required"
    }),
    password: joi_1.default.string().required().messages({
        "any.required": "Password is required"
    })
});
exports.updateProfileSchema = joi_1.default.object({
    username: joi_1.default.string().min(3).max(30).optional(),
    avatar: joi_1.default.string().uri().allow("", null).optional(),
    statusMessage: joi_1.default.string().max(100).allow("", null).optional()
});
