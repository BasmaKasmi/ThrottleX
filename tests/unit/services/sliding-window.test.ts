import { SlidingWindowRateLimiter } from '../../../src/services/sliding-window.service';

describe('SlidingWindowRateLimiter', () => {
  let rateLimiter: SlidingWindowRateLimiter;

  beforeEach(() => {
    rateLimiter = new SlidingWindowRateLimiter();
  });

  describe('evaluate', () => {
    it('should allow requests within limit', async () => {
      const result = await rateLimiter.evaluate('tenant-1', '/api/test', 10, 60);
      
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
      expect(result.resetAt).toBeGreaterThan(Date.now() / 1000);
    });

    it('should block requests exceeding limit', async () => {
      const limit = 5;
      const windowSeconds = 60;

    
      for (let i = 0; i < limit; i++) {
        const result = await rateLimiter.evaluate('tenant-1', '/api/test', limit, windowSeconds);
        expect(result.allowed).toBe(true);
      }

      const blockedResult = await rateLimiter.evaluate('tenant-1', '/api/test', limit, windowSeconds);
      expect(blockedResult.allowed).toBe(false);
      expect(blockedResult.remaining).toBe(0);
    });

    it('should reset counter after window expires', async () => {
      const limit = 3;
      const windowSeconds = 1; // 1 second window

      for (let i = 0; i < limit; i++) {
        await rateLimiter.evaluate('tenant-1', '/api/test', limit, windowSeconds);
      }

      await new Promise(resolve => setTimeout(resolve, 1100));

      const result = await rateLimiter.evaluate('tenant-1', '/api/test', limit, windowSeconds);
      expect(result.allowed).toBe(true);
    });

    it('should handle multiple tenants independently', async () => {
      const limit = 5;
      const windowSeconds = 60;

      for (let i = 0; i < limit; i++) {
        await rateLimiter.evaluate('tenant-1', '/api/test', limit, windowSeconds);
      }

      const result = await rateLimiter.evaluate('tenant-2', '/api/test', limit, windowSeconds);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(limit - 1);
    });

    it('should handle different routes independently', async () => {
      const limit = 5;
      const windowSeconds = 60;

      for (let i = 0; i < limit; i++) {
        await rateLimiter.evaluate('tenant-1', '/api/route1', limit, windowSeconds);
      }

      const result = await rateLimiter.evaluate('tenant-1', '/api/route2', limit, windowSeconds);
      expect(result.allowed).toBe(true);
    });

    it('should correctly calculate remaining requests', async () => {
      const limit = 10;
      const windowSeconds = 60;

      for (let i = 0; i < 5; i++) {
        const result = await rateLimiter.evaluate('tenant-1', '/api/test', limit, windowSeconds);
        expect(result.remaining).toBe(limit - i - 1);
      }
    });
  });
});
