import "reflect-metadata";
import { DataSource } from "typeorm";
import bcrypt from "bcryptjs";

// Entities definitions for standalone script execution
import { User } from "./auth-service/src/entities/User";
import { Conversation } from "./chat-service/src/entities/Conversation";
import { Message, MessageStatus, MessageType } from "./chat-service/src/entities/Message";
import { Notification, NotificationType } from "./notification-service/src/entities/Notification";

const seedDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "rootpassword",
  database: process.env.DB_NAME || "whatsapp_db",
  synchronize: true,
  logging: false,
  entities: [User, Conversation, Message, Notification]
});

async function runSeed() {
  console.log("🌱 Starting Database Seeding...");
  await seedDataSource.initialize();

  const userRepo = seedDataSource.getRepository(User);
  const convRepo = seedDataSource.getRepository(Conversation);
  const msgRepo = seedDataSource.getRepository(Message);
  const notifRepo = seedDataSource.getRepository(Notification);

  // Clear existing tables
  await msgRepo.delete({});
  await convRepo.delete({});
  await notifRepo.delete({});
  await userRepo.delete({});

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Create Sample Users
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
    isOnline: false,
    lastSeen: new Date()
  });

  await userRepo.save([ahmed, sara, omar]);
  console.log("✅ Users created: Ahmed, Sara, Omar (Password: password123)");

  // 2. Create 1-on-1 Conversation between Ahmed & Sara
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
    content: "Hey Ahmed! Did you complete the Docker compose and TypeORM setup?",
    type: MessageType.TEXT,
    status: MessageStatus.READ
  });

  const msg2 = msgRepo.create({
    conversationId: directConv.id,
    senderId: ahmed.id,
    content: "Yes Sara! Node.js microservices with Joi, Socket.io, React Query, and Nginx Gateway are all ready!",
    type: MessageType.TEXT,
    status: MessageStatus.READ
  });

  const msg3 = msgRepo.create({
    conversationId: directConv.id,
    senderId: sara.id,
    content: "Awesome! The WhatsApp Web microservices architecture looks incredible! 🚀",
    type: MessageType.TEXT,
    status: MessageStatus.READ
  });

  await msgRepo.save([msg1, msg2, msg3]);

  // 3. Create Group Conversation
  const groupConv = convRepo.create({
    isGroup: true,
    name: "Engineering Lead Team",
    groupAvatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=250&q=80",
    participants: [ahmed, sara, omar],
    lastMessageContent: "Deployment pipelines verified.",
    lastMessageTime: new Date()
  });
  await convRepo.save(groupConv);

  const groupMsg = msgRepo.create({
    conversationId: groupConv.id,
    senderId: omar.id,
    content: "Deployment pipelines verified across all 3 microservices.",
    type: MessageType.TEXT,
    status: MessageStatus.DELIVERED
  });
  await msgRepo.save(groupMsg);

  // 4. Sample Notification
  const notif = notifRepo.create({
    userId: ahmed.id,
    title: "Welcome to WhatsApp Web",
    message: "Your microservices cluster is active.",
    type: NotificationType.SYSTEM_ALERT
  });
  await notifRepo.save(notif);

  console.log("🎉 Database Seeding completed successfully!");
  await seedDataSource.destroy();
}

runSeed().catch((err) => {
  console.error("❌ Seeding Error:", err);
  process.exit(1);
});
