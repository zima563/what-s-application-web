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

AppDataSource.initialize()
  .then(() => {
    console.log("✅ [Auth Service] Database connected successfully via TypeORM.");
    app.listen(PORT, () => {
      console.log(`🚀 [Auth Service] Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ [Auth Service] Database connection failed:", error);
  });
