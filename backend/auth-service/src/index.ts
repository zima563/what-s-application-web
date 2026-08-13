import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AppDataSource } from "./config/database";
import authRoutes from "./routes/authRoutes";
import { globalErrorHandler } from "./middlewares/errorMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", service: "Auth Microservice" });
});

// Global Error Handler
app.use(globalErrorHandler);

async function startServer() {
  let retries = 15;
  while (retries > 0) {
    try {
      await AppDataSource.initialize();
      console.log("✅ [Auth Service] Database connected successfully via TypeORM.");
      break;
    } catch (error) {
      console.error(`⚠️ [Auth Service] Database connection failed. Retrying in 3s... (${retries} attempts left)`, error);
      retries -= 1;
      await new Promise((res) => setTimeout(res, 3000));
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 [Auth Service] Server running on port ${PORT}`);
  });
}

startServer();
