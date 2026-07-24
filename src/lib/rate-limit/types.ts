export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt?: Date;
}

export interface RateLimiter {
  check(identifier: string): Promise<RateLimitResult>;
}
