import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import notificationRoutes from "./routes/notificationRoutes";
import { globalErrorHandler } from "./middlewares/errorMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/notifications", notificationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "Notification Microservice" });
});

// Global Error Handler
app.use(globalErrorHandler);

async function startServer() {
  let retries = 15;
  while (retries > 0) {
    try {
      await AppDataSource.initialize();
      console.log("✅ [Notification Service] Database connected successfully via TypeORM.");
      break;
    } catch (error) {
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
