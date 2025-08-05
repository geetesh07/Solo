import { z } from 'zod';

// Common validation schemas
export const goalSchema = z.object({
  title: z.string()
    .min(1, 'Quest title is required')
    .max(100, 'Quest title must be less than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  category: z.string()
    .min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high'], {
    errorMap: () => ({ message: 'Priority must be low, medium, or high' })
  }),
  dueDate: z.string()
    .datetime({ message: 'Invalid due date format' })
    .optional(),
  xpReward: z.number()
    .min(1, 'XP reward must be at least 1')
    .max(100, 'XP reward cannot exceed 100')
    .int('XP reward must be a whole number')
    .default(10),
});

export const categorySchema = z.object({
  name: z.string()
    .min(1, 'Category name is required')
    .max(50, 'Category name must be less than 50 characters')
    .trim(),
  icon: z.string()
    .min(1, 'Icon is required')
    .max(10, 'Icon must be less than 10 characters'),
  color: z.string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex code')
    .optional(),
});

export const noteSchema = z.object({
  title: z.string()
    .min(1, 'Note title is required')
    .max(100, 'Note title must be less than 100 characters')
    .trim(),
  content: z.string()
    .min(1, 'Note content is required')
    .max(10000, 'Note content must be less than 10,000 characters')
    .trim(),
  tags: z.array(z.string().max(20, 'Tag must be less than 20 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .default([]),
});

export const userProfileSchema = z.object({
  displayName: z.string()
    .min(1, 'Display name is required')
    .max(50, 'Display name must be less than 50 characters')
    .trim(),
  level: z.number()
    .min(1, 'Level must be at least 1')
    .max(100, 'Level cannot exceed 100')
    .int('Level must be a whole number'),
  xp: z.number()
    .min(0, 'XP cannot be negative')
    .int('XP must be a whole number'),
  streak: z.number()
    .min(0, 'Streak cannot be negative')
    .int('Streak must be a whole number'),
});

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system'], {
    errorMap: () => ({ message: 'Theme must be light, dark, or system' })
  }),
  notifications: z.object({
    enabled: z.boolean(),
    reminderTimes: z.array(z.object({
      id: z.string(),
      time: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
      label: z.string().max(50, 'Label must be less than 50 characters'),
      enabled: z.boolean(),
    })).max(5, 'Maximum 5 reminder times allowed'),
  }),
});

// Input sanitization helpers
export function sanitizeText(text: string): string {
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/javascript:/gi, '') // Remove javascript: urls
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
    .replace(/on\w+='[^']*'/gi, ''); // Remove event handlers with single quotes
}

export function sanitizeHtml(html: string): string {
  // Basic HTML sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '');
}

// Rate limiting helper
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  
  constructor(
    private maxAttempts: number = 5,
    private windowMs: number = 60000 // 1 minute
  ) {}
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const validAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (validAttempts.length >= this.maxAttempts) {
      return false;
    }
    
    validAttempts.push(now);
    this.attempts.set(key, validAttempts);
    return true;
  }
  
  getRemainingTime(key: string): number {
    const attempts = this.attempts.get(key) || [];
    if (attempts.length === 0) return 0;
    
    const oldestAttempt = Math.min(...attempts);
    const remaining = this.windowMs - (Date.now() - oldestAttempt);
    return Math.max(0, remaining);
  }
}

// Global rate limiter instances
export const createGoalLimiter = new RateLimiter(10, 60000); // 10 goals per minute
export const updateGoalLimiter = new RateLimiter(20, 60000); // 20 updates per minute
export const createNoteLimiter = new RateLimiter(5, 60000); // 5 notes per minute

// Validation error formatter
export function formatValidationError(error: z.ZodError): string {
  return error.errors
    .map(err => `${err.path.join('.')}: ${err.message}`)
    .join(', ');
}

// Type guards
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.getTime() > Date.now() - 86400000; // Not more than 1 day in the past
}