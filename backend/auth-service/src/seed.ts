import "reflect-metadata";
import { DataSource } from "typeorm";
import bcrypt from "bcryptjs";
import path from "path";
import { User } from "../../chat-service/src/entities/User";
import { Conversation } from "../../chat-service/src/entities/Conversation";
import { Message, MessageStatus, MessageType } from "../../chat-service/src/entities/Message";
import { Notification, NotificationType } from "../../notification-service/src/entities/Notification";

const useSqlite = process.env.DB_TYPE === "sqlite" || !process.env.DB_HOST || process.env.DB_HOST === "localhost";

const seedDataSource = new DataSource(
  useSqlite
    ? {
        type: "sqlite",
        database: path.join(__dirname, "../../../whatsapp.sqlite"),
        synchronize: true,
        logging: false,
        entities: [User, Conversation, Message, Notification]
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
        entities: [User, Conversation, Message, Notification]
      }
);

async function runSeed() {
  console.log("🌱 Starting Database Seeding...");
  await seedDataSource.initialize();

  const userRepo = seedDataSource.getRepository(User);
  const convRepo = seedDataSource.getRepository(Conversation);
  const msgRepo = seedDataSource.getRepository(Message);
  const notifRepo = seedDataSource.getRepository(Notification);

  // Clear existing
  await msgRepo.clear();
  await convRepo.clear();
  await notifRepo.clear();
  await userRepo.clear();

  const hashedPassword = await bcrypt.hash("password123", 10);

  const ahmed = userRepo.create({
    username: "Ahmed Hassan",
    email: "ahmed@whatsapp.com",
    password: hashedPassword,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    statusMessage: "Senior Full Stack Engineer | Node & React",
    isOnline: true
  });

  const sara = userRepo.create({
    username: "Sara Ali",
    email: "sara@whatsapp.com",
    password: hashedPassword,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80",
    statusMessage: "UI/UX Designer & Product Lead",
    isOnline: true
  });

  const omar = userRepo.create({
    username: "Omar Khaled",
    email: "omar@whatsapp.com",
    password: hashedPassword,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80",
    statusMessage: "DevOps & Cloud Architect",
    isOnline: false
  });

  await userRepo.save([ahmed, sara, omar]);
  console.log("✅ Demo Users Created Successfully:");
  console.log("   1. ahmed@whatsapp.com | Password: password123");
  console.log("   2. sara@whatsapp.com  | Password: password123");
  console.log("   3. omar@whatsapp.com  | Password: password123");

  const directConv = convRepo.create({
    isGroup: false,
    participants: [ahmed, sara],
    lastMessageContent: "Awesome! The WhatsApp Web microservices architecture looks incredible! 🚀",
    lastMessageTime: new Date()
  });
  await convRepo.save(directConv);

  const msg1 = msgRepo.create({
    conversationId: directConv.id,
    senderId: sara.id,
    sender: sara,
    content: "Hey Ahmed! Did you complete the Docker compose and TypeORM setup?",
    type: MessageType.TEXT,
    status: MessageStatus.READ
  });

  const msg2 = msgRepo.create({
    conversationId: directConv.id,
    senderId: ahmed.id,
    sender: ahmed,
    content: "Yes Sara! Node.js microservices with Joi, Socket.io, React Query, and Nginx Gateway are all ready!",
    type: MessageType.TEXT,
    status: MessageStatus.READ
  });

  await msgRepo.save([msg1, msg2]);

  console.log("🎉 Database Seeding completed successfully!");
  process.exit(0);
}

runSeed().catch((err) => {
  console.error("❌ Seeding Error:", err);
  process.exit(1);
});
