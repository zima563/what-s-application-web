"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Notification_1 = require("../entities/Notification");
const path_1 = __importDefault(require("path"));
const useSqlite = process.env.DB_TYPE === "sqlite" || !process.env.DB_HOST || process.env.DB_HOST === "localhost";
exports.AppDataSource = new typeorm_1.DataSource(useSqlite
    ? {
        type: "sqlite",
        database: path_1.default.join(__dirname, "../../../whatsapp.sqlite"),
        synchronize: true,
        logging: false,
        entities: [Notification_1.Notification]
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
        entities: [Notification_1.Notification]
    });
