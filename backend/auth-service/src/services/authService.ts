import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import { AppError } from "../utils/AppError";

export class AuthService {
  private userRepository = AppDataSource.getRepository(User);

  private generateToken(user: User): string {
    const secret = process.env.JWT_SECRET || "supersecretwhatsappkey123";
    return jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      secret,
      { expiresIn: "7d" }
    );
  }

  async register(data: { username: string; email: string; password: string; avatar?: string; statusMessage?: string }) {
    const existingEmail = await this.userRepository.findOne({ where: { email: data.email } });
    if (existingEmail) {
      throw new AppError("Email is already registered. Please sign in or use another email.", 400);
    }

    const existingUsername = await this.userRepository.findOne({ where: { username: data.username } });
    if (existingUsername) {
      throw new AppError("Username is already taken. Please choose another username.", 400);
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = this.userRepository.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      avatar: data.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
      statusMessage: data.statusMessage || "Hey there! I am using WhatsApp."
    });

    await this.userRepository.save(user);

    const token = this.generateToken(user);

    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userRepository
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: data.email })
      .getOne();

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    // Set online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await this.userRepository.save(user);

    const token = this.generateToken(user);
    const { password, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return user;
  }

  async searchUsers(query: string, currentUserId: string) {
    const users = await this.userRepository
      .createQueryBuilder("user")
      .where("(user.username LIKE :q OR user.email LIKE :q)", { q: `%${query}%` })
      .andWhere("user.id != :currentUserId", { currentUserId })
      .select(["user.id", "user.username", "user.email", "user.avatar", "user.statusMessage", "user.isOnline", "user.lastSeen"])
      .limit(20)
      .getMany();

    return users;
  }

  async updateProfile(userId: string, data: { username?: string; avatar?: string; statusMessage?: string }) {
    const user = await this.getUserById(userId);
    if (data.username) user.username = data.username;
    if (data.avatar) user.avatar = data.avatar;
    if (data.statusMessage) user.statusMessage = data.statusMessage;

    await this.userRepository.save(user);
    return user;
  }

  async getAllUsers(currentUserId: string) {
    return this.userRepository
      .createQueryBuilder("user")
      .where("user.id != :currentUserId", { currentUserId })
      .select(["user.id", "user.username", "user.email", "user.avatar", "user.statusMessage", "user.isOnline", "user.lastSeen"])
      .getMany();
  }
}
