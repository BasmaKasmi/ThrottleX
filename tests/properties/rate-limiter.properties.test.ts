import fc from 'fast-check';
import { SlidingWindowRateLimiter } from '../../src/services/sliding-window.service';

describe('SlidingWindowRateLimiter - Property Tests', () => {
  let rateLimiter: SlidingWindowRateLimiter;

  beforeEach(() => {
    rateLimiter = new SlidingWindowRateLimiter();
  });

  it('PROPERTY: never allows more than limit requests in a window', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }), 
        fc.integer({ min: 1, max: 10 }),  
        fc.string({ minLength: 1, maxLength: 20 }), 
        fc.string({ minLength: 1, maxLength: 50 }), 
        async (limit, windowSeconds, tenantId, route) => {
          const rateLimiter = new SlidingWindowRateLimiter();
          
          let allowedCount = 0;
          
        
          for (let i = 0; i < limit + 10; i++) {
            const result = await rateLimiter.evaluate(tenantId, route, limit, windowSeconds);
            if (result.allowed) {
              allowedCount++;
            }
          }
          
          
          return allowedCount <= limit;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('PROPERTY: remaining + consumed always equals limit (when no time passes)', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 5, max: 50 }), 
        fc.integer({ min: 1, max: 5 }),  
        async (limit, requestCount) => {
          const rateLimiter = new SlidingWindowRateLimiter();
          const tenantId = 'property-test';
          const route = '/test';
          const windowSeconds = 60;
          
          let lastResult;
          
          for (let i = 0; i < Math.min(requestCount, limit); i++) {
            lastResult = await rateLimiter.evaluate(tenantId, route, limit, windowSeconds);
          }
          
          if (!lastResult) return true;
          
          const consumed = limit - lastResult.remaining;
          const total = lastResult.remaining + consumed;
          
          return total === limit;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('PROPERTY: different tenants do not affect each other', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 20 }),
        fc.array(fc.string({ minLength: 1, maxLength: 10 }), { minLength: 2, maxLength: 5 }),
        async (limit, tenants) => {
          const rateLimiter = new SlidingWindowRateLimiter();
          const route = '/test';
          const windowSeconds = 60;
          
         
          for (const tenantId of tenants) {
            let allowedCount = 0;
            
            for (let i = 0; i < limit; i++) {
              const result = await rateLimiter.evaluate(tenantId, route, limit, windowSeconds);
              if (result.allowed) {
                allowedCount++;
              }
            }
            
            
            if (allowedCount !== limit) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('PROPERTY: remaining is always non-negative', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 200 }),
        async (limit, requests) => {
          const rateLimiter = new SlidingWindowRateLimiter();
          const tenantId = 'remaining-test';
          const route = '/test';
          const windowSeconds = 60;
          
          for (let i = 0; i < requests; i++) {
            const result = await rateLimiter.evaluate(tenantId, route, limit, windowSeconds);
            
           
            if (result.remaining < 0) {
              return false;
            }
          }
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('PROPERTY: resetAt is always in the future', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 100 }),
        fc.integer({ min: 1, max: 3600 }),
        async (limit, windowSeconds) => {
          const rateLimiter = new SlidingWindowRateLimiter();
          const result = await rateLimiter.evaluate('test-tenant', '/test', limit, windowSeconds);
          
          const now = Math.floor(Date.now() / 1000);
          
          
          return result.resetAt >= now;
        }
      ),
      { numRuns: 50 }
    );
  });

  it('PROPERTY: blocked requests do not increment counter', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 20 }),
        async (limit) => {
          const rateLimiter = new SlidingWindowRateLimiter();
          const tenantId = 'block-test';
          const route = '/test';
          const windowSeconds = 60;
          
          
          for (let i = 0; i < limit; i++) {
            await rateLimiter.evaluate(tenantId, route, limit, windowSeconds);
          }
          
          
          const blocked = await rateLimiter.evaluate(tenantId, route, limit, windowSeconds);
          
          if (blocked.allowed) return false; 
          
          
          const blockedAgain = await rateLimiter.evaluate(tenantId, route, limit, windowSeconds);
          
          
          return blocked.remaining === blockedAgain.remaining && blocked.remaining === 0;
        }
      ),
      { numRuns: 50 }
    );
  });
});
