import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.firebaseUid === firebaseUid,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser,
      displayName: insertUser.displayName || null,
      id,
      createdAt: new Date(),
      level: insertUser.level || 1,
      currentXP: insertUser.currentXP || 0,
      totalXP: insertUser.totalXP || 0,
      streak: insertUser.streak || 0,
      rank: insertUser.rank || "E-Rank"
    };
    this.users.set(id, user);
    return user;
  }
}

export const storage = new MemStorage();
