"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.updateProfile = exports.searchUsers = exports.getMe = exports.login = exports.register = void 0;
const authService_1 = require("../services/authService");
const asyncHandler_1 = require("../utils/asyncHandler");
const AppError_1 = require("../utils/AppError");
const authValidation_1 = require("../validations/authValidation");
const authService = new authService_1.AuthService();
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { error, value } = authValidation_1.registerSchema.validate(req.body);
    if (error) {
        return next(new AppError_1.AppError(error.details[0].message, 400));
    }
    const result = await authService.register(value);
    res.status(201).json({
        status: "success",
        data: result
    });
});
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { error, value } = authValidation_1.loginSchema.validate(req.body);
    if (error) {
        return next(new AppError_1.AppError(error.details[0].message, 400));
    }
    const result = await authService.login(value);
    res.status(200).json({
        status: "success",
        data: result
    });
});
exports.getMe = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    if (!req.user) {
        return next(new AppError_1.AppError("Not authenticated", 401));
    }
    const user = await authService.getUserById(req.user.id);
    res.status(200).json({
        status: "success",
        data: { user }
    });
});
exports.searchUsers = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const query = req.query.q || "";
    const currentUserId = req.user.id;
    const users = await authService.searchUsers(query, currentUserId);
    res.status(200).json({
        status: "success",
        data: { users }
    });
});
exports.updateProfile = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const { error, value } = authValidation_1.updateProfileSchema.validate(req.body);
    if (error) {
        return next(new AppError_1.AppError(error.details[0].message, 400));
    }
    const user = await authService.updateProfile(req.user.id, value);
    res.status(200).json({
        status: "success",
        data: { user }
    });
});
exports.getAllUsers = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const users = await authService.getAllUsers(req.user.id);
    res.status(200).json({
        status: "success",
        data: { users }
    });
});
