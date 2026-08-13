"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    error.statusCode = err.statusCode || 500;
    res.status(error.statusCode).json({
        status: error.statusCode >= 500 ? "error" : "fail",
        message: error.message || "Internal Server Error"
    });
};
exports.globalErrorHandler = globalErrorHandler;
