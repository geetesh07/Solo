import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { users, calendarEvents, notes, insertCalendarEventSchema, insertNoteSchema, insertUserSchema } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // User authentication routes
  app.post("/api/auth/user", async (req, res) => {
    try {
      const { firebaseUid, email, displayName } = req.body;
      
      if (!firebaseUid || !email) {
        return res.status(400).json({ error: "Firebase UID and email are required" });
      }

      // Check if user already exists
      const [existingUser] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
      
      if (existingUser) {
        return res.json(existingUser);
      }

      // Create new user
      const userData = insertUserSchema.parse({
        firebaseUid,
        email,
        displayName: displayName || null
      });
      
      const [newUser] = await db.insert(users).values(userData).returning();
      res.json(newUser);
    } catch (error) {
      console.error("Error handling user authentication:", error);
      res.status(500).json({ error: "Failed to authenticate user" });
    }
  });

  app.get("/api/auth/user/:firebaseUid", async (req, res) => {
    try {
      const { firebaseUid } = req.params;
      const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
      
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  // Helper function to get user ID from Firebase UID
  const getUserId = async (firebaseUid: string) => {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user?.id;
  };

  // Calendar Events API
  app.get("/api/calendar-events", async (req, res) => {
    try {
      const firebaseUid = req.headers['x-firebase-uid'] as string;
      if (!firebaseUid) {
        return res.status(401).json({ error: "Firebase UID required" });
      }
      
      const userId = await getUserId(firebaseUid);
      if (!userId) {
        return res.status(404).json({ error: "User not found" });
      }
      const events = await db.select().from(calendarEvents).where(eq(calendarEvents.userId, userId));
      res.json(events);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });

  app.post("/api/calendar-events", async (req, res) => {
    try {
      const firebaseUid = req.headers['x-firebase-uid'] as string;
      if (!firebaseUid) {
        return res.status(401).json({ error: "Firebase UID required" });
      }
      
      const userId = await getUserId(firebaseUid);
      if (!userId) {
        return res.status(404).json({ error: "User not found" });
      }
      const eventData = insertCalendarEventSchema.parse({ ...req.body, userId });
      const [event] = await db.insert(calendarEvents).values(eventData).returning();
      res.json(event);
    } catch (error) {
      console.error("Error creating calendar event:", error);
      res.status(500).json({ error: "Failed to create calendar event" });
    }
  });

  app.put("/api/calendar-events/:id", async (req, res) => {
    try {
      const firebaseUid = req.headers['x-firebase-uid'] as string;
      if (!firebaseUid) {
        return res.status(401).json({ error: "Firebase UID required" });
      }
      
      const userId = await getUserId(firebaseUid);
      if (!userId) {
        return res.status(404).json({ error: "User not found" });
      }
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };
      const [event] = await db.update(calendarEvents)
        .set(updateData)
        .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)))
        .returning();
      res.json(event);
    } catch (error) {
      console.error("Error updating calendar event:", error);
      res.status(500).json({ error: "Failed to update calendar event" });
    }
  });

  app.delete("/api/calendar-events/:id", async (req, res) => {
    try {
      const firebaseUid = req.headers['x-firebase-uid'] as string;
      if (!firebaseUid) {
        return res.status(401).json({ error: "Firebase UID required" });
      }
      
      const userId = await getUserId(firebaseUid);
      if (!userId) {
        return res.status(404).json({ error: "User not found" });
      }
      const { id } = req.params;
      await db.delete(calendarEvents)
        .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting calendar event:", error);
      res.status(500).json({ error: "Failed to delete calendar event" });
    }
  });

  // Notes API
  app.get("/api/notes", async (req, res) => {
    try {
      const firebaseUid = req.headers['x-firebase-uid'] as string;
      if (!firebaseUid) {
        return res.status(401).json({ error: "Firebase UID required" });
      }
      
      const userId = await getUserId(firebaseUid);
      if (!userId) {
        return res.status(404).json({ error: "User not found" });
      }
      const userNotes = await db.select().from(notes).where(eq(notes.userId, userId));
      res.json(userNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const firebaseUid = req.headers['x-firebase-uid'] as string;
      if (!firebaseUid) {
        return res.status(401).json({ error: "Firebase UID required" });
      }
      
      const userId = await getUserId(firebaseUid);
      if (!userId) {
        return res.status(404).json({ error: "User not found" });
      }
      const noteData = insertNoteSchema.parse({ ...req.body, userId });
      const [note] = await db.insert(notes).values(noteData).returning();
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ error: "Failed to create note" });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const firebaseUid = req.headers['x-firebase-uid'] as string;
      if (!firebaseUid) {
        return res.status(401).json({ error: "Firebase UID required" });
      }
      
      const userId = await getUserId(firebaseUid);
      if (!userId) {
        return res.status(404).json({ error: "User not found" });
      }
      const { id } = req.params;
      const updateData = { ...req.body, updatedAt: new Date() };
      const [note] = await db.update(notes)
        .set(updateData)
        .where(and(eq(notes.id, id), eq(notes.userId, userId)))
        .returning();
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ error: "Failed to update note" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const firebaseUid = req.headers['x-firebase-uid'] as string;
      if (!firebaseUid) {
        return res.status(401).json({ error: "Firebase UID required" });
      }
      
      const userId = await getUserId(firebaseUid);
      if (!userId) {
        return res.status(404).json({ error: "User not found" });
      }
      const { id } = req.params;
      await db.delete(notes)
        .where(and(eq(notes.id, id), eq(notes.userId, userId)));
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ error: "Failed to delete note" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
