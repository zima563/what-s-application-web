"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const chatSocket_1 = require("./sockets/chatSocket");
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const PORT = process.env.PORT || 5002;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// HTTP Routes
app.use("/api/v1/chats", chatRoutes_1.default);
// Health check
app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", service: "Chat Microservice" });
});
// Global Error Handler
app.use(errorMiddleware_1.globalErrorHandler);
// Socket.io initialization
(0, chatSocket_1.setupSocketIO)(io);
database_1.AppDataSource.initialize()
    .then(() => {
    console.log("✅ [Chat Service] Database connected successfully via TypeORM.");
    server.listen(PORT, () => {
        console.log(`🚀 [Chat Service] HTTP & WebSockets running on port ${PORT}`);
    });
})
    .catch((error) => {
    console.error("❌ [Chat Service] Database connection failed:", error);
});
