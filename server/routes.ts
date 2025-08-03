import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { calendarEvents, notes, insertCalendarEventSchema, insertNoteSchema } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export async function registerRoutes(app: Express): Promise<Server> {
  // Calendar Events API
  app.get("/api/calendar-events", async (req, res) => {
    try {
      // For now, use a dummy user ID until auth is implemented
      const userId = "temp-user-id";
      const events = await db.select().from(calendarEvents).where(eq(calendarEvents.userId, userId));
      res.json(events);
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      res.status(500).json({ error: "Failed to fetch calendar events" });
    }
  });

  app.post("/api/calendar-events", async (req, res) => {
    try {
      const userId = "temp-user-id";
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
      const userId = "temp-user-id";
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
      const userId = "temp-user-id";
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
      const userId = "temp-user-id";
      const userNotes = await db.select().from(notes).where(eq(notes.userId, userId));
      res.json(userNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const userId = "temp-user-id";
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
      const userId = "temp-user-id";
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
      const userId = "temp-user-id";
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
