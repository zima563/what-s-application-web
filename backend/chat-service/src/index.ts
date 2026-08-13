import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import chatRoutes from "./routes/chatRoutes";
import { setupSocketIO } from "./sockets/chatSocket";
import { globalErrorHandler } from "./middlewares/errorMiddleware";

dotenv.config();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5002;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(cors());
app.use(express.json());

// HTTP Routes
app.use("/api/v1/chats", chatRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "Chat Microservice" });
});

// Global Error Handler
app.use(globalErrorHandler);

// Socket.io initialization
setupSocketIO(io);

async function startServer() {
  let retries = 15;
  while (retries > 0) {
    try {
      await AppDataSource.initialize();
      console.log("✅ [Chat Service] Database connected successfully via TypeORM.");
      break;
    } catch (error) {
      console.error(`⚠️ [Chat Service] Database connection failed. Retrying in 3s... (${retries} attempts left)`, error);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  server.listen(PORT, () => {
    console.log(`🚀 [Chat Service] HTTP & WebSockets running on port ${PORT}`);
  });
}

startServer();
