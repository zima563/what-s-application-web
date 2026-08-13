"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5003;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/v1/notifications", notificationRoutes_1.default);
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", service: "Notification Microservice" });
});
// Global Error Handler
app.use(errorMiddleware_1.globalErrorHandler);
async function startServer() {
    let retries = 15;
    while (retries > 0) {
        try {
            await database_1.AppDataSource.initialize();
            console.log("✅ [Notification Service] Database connected successfully via TypeORM.");
            break;
        }
        catch (error) {
            console.error(`⚠️ [Notification Service] Database connection failed. Retrying in 3s... (${retries} attempts left)`, error);
            retries -= 1;
            await new Promise((res) => setTimeout(res, 3000));
        }
    }
    app.listen(PORT, () => {
        console.log(`🚀 [Notification Service] Server running on port ${PORT}`);
    });
}
startServer();
