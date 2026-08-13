import "reflect-metadata";
import { DataSource } from "typeorm";
import { Notification } from "../entities/Notification";
import path from "path";

const useSqlite = process.env.DB_TYPE === "sqlite" || !process.env.DB_HOST || process.env.DB_HOST === "localhost";

export const AppDataSource = new DataSource(
  useSqlite
    ? {
        type: "sqlite",
        database: path.join(__dirname, "../../../whatsapp.sqlite"),
        synchronize: true,
        logging: false,
        entities: [Notification]
      }
    : {
        type: "mysql",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "rootpassword",
        database: process.env.DB_NAME || "whatsapp_db",
        synchronize: true,
        logging: false,
        entities: [Notification]
      }
);
