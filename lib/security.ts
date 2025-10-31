/**
 * Security utilities for sanitizing and validating user input
 */

const MAX_STRING_LENGTH = 10000; // 10KB
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; // 5MB total localStorage limit

/**
 * Sanitize string input to prevent XSS attacks
 * Removes potentially dangerous characters while preserving emojis and international text
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input) return '';
  
  // Convert to string and limit length
  const str = String(input).slice(0, MAX_STRING_LENGTH);
  
  // Remove script tags and event handlers
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:text\/html/gi, '');
}

/**
 * Sanitize HTML to prevent XSS while allowing safe formatting
 */
export function sanitizeHTML(html: string | null | undefined): string {
  if (!html) return '';
  
  const str = sanitizeString(html);
  
  // Only allow safe HTML tags
  const allowedTags = ['b', 'i', 'u', 'strong', 'em', 'br', 'p', 'span'];
  const tagPattern = new RegExp(`<(?!\/?(${allowedTags.join('|')})\b)[^>]+>`, 'gi');
  
  return str.replace(tagPattern, '');
}

/**
 * Validate and sanitize number input
 */
export function sanitizeNumber(input: unknown, min?: number, max?: number): number {
  const num = Number(input);
  
  if (isNaN(num) || !isFinite(num)) {
    return 0;
  }
  
  let result = num;
  if (min !== undefined && result < min) result = min;
  if (max !== undefined && result > max) result = max;
  
  return result;
}

/**
 * Validate localStorage key format
 */
export function isValidStorageKey(key: string): boolean {
  // Only allow keys with specific prefix and alphanumeric characters
  const validPattern = /^(sourdough|dope-dough):[a-z0-9-]+$/i;
  return validPattern.test(key);
}

/**
 * Safely parse JSON from localStorage with validation
 */
export function safeParseJSON<T>(
  jsonString: string | null,
  validator?: (data: unknown) => data is T
): T | null {
  if (!jsonString) return null;
  
  try {
    const parsed = JSON.parse(jsonString);
    
    // If validator provided, use it
    if (validator && !validator(parsed)) {
      console.warn('[Security] Invalid data structure in localStorage');
      return null;
    }
    
    return parsed as T;
  } catch (error) {
    console.error('[Security] Failed to parse localStorage data:', error);
    return null;
  }
}

/**
 * Safely stringify and store data in localStorage with size check
 * Handles SSR/SSG where localStorage is undefined
 */
export function safeSetItem(key: string, value: unknown): boolean {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false;
  }
  
  if (!isValidStorageKey(key)) {
    console.error('[Security] Invalid localStorage key format:', key);
    return false;
  }
  
  try {
    const jsonString = JSON.stringify(value);
    
    // Check size before storing
    if (jsonString.length > MAX_STORAGE_SIZE) {
      console.error('[Security] Data exceeds maximum storage size');
      return false;
    }
    
    localStorage.setItem(key, jsonString);
    return true;
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Security] Failed to store data:', error);
    }
    return false;
  }
}

/**
 * Safely get item from localStorage with validation
 * Handles SSR/SSG where localStorage is undefined
 */
export function safeGetItem<T>(
  key: string,
  validator?: (data: unknown) => data is T
): T | null {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return null;
  }
  
  if (!isValidStorageKey(key)) {
    console.error('[Security] Invalid localStorage key format:', key);
    return null;
  }
  
  try {
    const item = localStorage.getItem(key);
    return safeParseJSON<T>(item, validator);
  } catch (error) {
    // Only log errors in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Security] Failed to retrieve data:', error);
    }
    return null;
  }
}

/**
 * Check if localStorage is available and not full
 * Safe for SSR/SSG environments
 */
export function isStorageAvailable(): boolean {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false;
  }
  
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Calculate current localStorage usage
 */
export function getStorageUsage(): { used: number; percentage: number } {
  let used = 0;
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const item = localStorage.getItem(key);
        if (item) {
          used += key.length + item.length;
        }
      }
    }
  } catch (error) {
    console.error('[Security] Failed to calculate storage usage:', error);
  }
  
  return {
    used,
    percentage: (used / MAX_STORAGE_SIZE) * 100
  };
}

/**
 * Validate timer data structure
 */
export function isValidTimerData(data: unknown): data is {
  state: {
    timers: Record<string, unknown>;
    progress: unknown;
  };
} {
  if (!data || typeof data !== 'object') return false;
  
  const obj = data as Record<string, unknown>;
  if (!obj.state || typeof obj.state !== 'object') return false;
  
  const state = obj.state as Record<string, unknown>;
  if (!state.timers || typeof state.timers !== 'object') return false;
  
  return true;
}

/**
 * Validate language data
 */
export function isValidLanguage(data: unknown): data is 'en' | 'ru' {
  return data === 'en' || data === 'ru';
}

/**
 * Rate limiter to prevent abuse
 */
export class RateLimiter {
  private attempts: Map<string, number[]> = new Map();
  private readonly maxAttempts: number;
  private readonly windowMs: number;
  
  constructor(maxAttempts: number = 10, windowMs: number = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }
  
  /**
   * Check if action is allowed
   */
  isAllowed(key: string): boolean {
    const now = Date.now();
    const attempts = this.attempts.get(key) || [];
    
    // Remove old attempts outside the window
    const recentAttempts = attempts.filter(time => now - time < this.windowMs);
    
    if (recentAttempts.length >= this.maxAttempts) {
      console.warn(`[Security] Rate limit exceeded for: ${key}`);
      return false;
    }
    
    // Add current attempt
    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    
    return true;
  }
  
  /**
   * Reset rate limiter for specific key
   */
  reset(key: string): void {
    this.attempts.delete(key);
  }
  
  /**
   * Clear all rate limit data
   */
  clear(): void {
    this.attempts.clear();
  }
}

// Export singleton rate limiters for common operations
export const notificationRateLimiter = new RateLimiter(5, 60000); // 5 per minute
export const storageRateLimiter = new RateLimiter(50, 60000); // 50 per minute
