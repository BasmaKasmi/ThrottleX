export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
  }
  
  export interface IRateLimiter {
    evaluate(tenantId: string, route: string, limit: number, windowSeconds: number): Promise<RateLimitResult>;
  }