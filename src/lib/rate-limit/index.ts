import type { RateLimiter, RateLimitResult } from "./types";

/**
 * In-memory stub for local development.
 * Replace with Upstash Redis implementation for production.
 *
 * Example Upstash wiring (future):
 *   import { Ratelimit } from "@upstash/ratelimit";
 *   import { Redis } from "@upstash/redis";
 */
class InMemoryRateLimiter implements RateLimiter {
  private requests = new Map<string, { count: number; resetAt: number }>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit = 20, windowMs = 60_000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  async check(identifier: string): Promise<RateLimitResult> {
    const now = Date.now();
    const entry = this.requests.get(identifier);

    if (!entry || now >= entry.resetAt) {
      this.requests.set(identifier, { count: 1, resetAt: now + this.windowMs });
      return { success: true, remaining: this.limit - 1 };
    }

    if (entry.count >= this.limit) {
      return {
        success: false,
        remaining: 0,
        resetAt: new Date(entry.resetAt),
      };
    }

    entry.count += 1;
    return { success: true, remaining: this.limit - entry.count };
  }
}

let rateLimiter: RateLimiter | null = null;

export function getRateLimiter(): RateLimiter {
  if (!rateLimiter) {
    const limit = parseInt(process.env.RATE_LIMIT_MAX ?? "20", 10);
    const windowSec = parseInt(process.env.RATE_LIMIT_WINDOW_SEC ?? "60", 10);
    rateLimiter = new InMemoryRateLimiter(limit, windowSec * 1000);
  }
  return rateLimiter;
}
