"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlidingWindowRateLimiter = void 0;
class SlidingWindowRateLimiter {
    requestLogs = new Map();
    generateKey(tenantId, route) {
        return `${tenantId}:${route}`;
    }
    async evaluate(tenantId, route, limit, windowSeconds) {
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
exports.SlidingWindowRateLimiter = SlidingWindowRateLimiter;
//# sourceMappingURL=sliding-window.service.js.map