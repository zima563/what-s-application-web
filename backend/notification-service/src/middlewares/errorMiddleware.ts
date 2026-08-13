import { Request, Response, NextFunction } from "express";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  res.status(error.statusCode).json({
    status: error.statusCode >= 500 ? "error" : "fail",
    message: error.message || "Internal Server Error"
  });
};
