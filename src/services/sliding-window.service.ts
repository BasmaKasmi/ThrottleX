import { IRateLimiter, RateLimitResult } from './rate-limiter.interface';

interface RequestLog {
  timestamps: number[];
  windowStart: number;
}

export class SlidingWindowRateLimiter implements IRateLimiter {
  private requestLogs: Map<string, RequestLog> = new Map();

  private generateKey(tenantId: string, route: string): string {
    return `${tenantId}:${route}`;
  }

  async evaluate(
    tenantId: string,
    route: string,
    limit: number,
    windowSeconds: number
  ): Promise<RateLimitResult> {
    const key = this.generateKey(tenantId, route);
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const windowStart = now - windowMs;

    
    let log = this.requestLogs.get(key);
    if (!log) {
      log = { timestamps: [], windowStart };
      this.requestLogs.set(key, log);
    }

    log.timestamps = log.timestamps.filter(ts => ts > windowStart);

   
    const currentCount = log.timestamps.length;
    const allowed = currentCount < limit;

    
    if (allowed) {
      log.timestamps.push(now);
    }

   
    const oldestTimestamp = log.timestamps[0] || now;
    const resetAt = Math.floor((oldestTimestamp + windowMs) / 1000);

    return {
      allowed,
      remaining: Math.max(0, limit - log.timestamps.length),
      resetAt
    };
  }
}