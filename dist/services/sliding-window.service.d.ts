import { IRateLimiter, RateLimitResult } from './rate-limiter.interface';
export declare class SlidingWindowRateLimiter implements IRateLimiter {
    private requestLogs;
    private generateKey;
    evaluate(tenantId: string, route: string, limit: number, windowSeconds: number): Promise<RateLimitResult>;
}
//# sourceMappingURL=sliding-window.service.d.ts.map