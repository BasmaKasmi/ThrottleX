import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../src/app';

describe('ThrottleX API Integration Tests', () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe('POST /policies', () => {
    it('should create a new policy', async () => {
      const policy = {
        tenantId: 't-test-01',
        scope: 'TENANT',
        algorithm: 'SLIDING_WINDOW',
        limit: 100,
        windowSeconds: 60
      };

      const response = await request(app)
        .post('/policies')
        .send(policy)
        .expect(201);

      expect(response.body).toMatchObject(policy);
    });

    it('should return 400 for invalid policy', async () => {
      const invalidPolicy = {
        tenantId: 't-test-01'
        
      };

      await request(app)
        .post('/policies')
        .send(invalidPolicy)
        .expect(400);
    });
  });

  describe('GET /policies/:tenantId', () => {
    it('should return policies for a tenant', async () => {
      // First create a policy
      const policy = {
        tenantId: 't-test-02',
        scope: 'TENANT',
        algorithm: 'SLIDING_WINDOW',
        limit: 50,
        windowSeconds: 60
      };

      await request(app)
        .post('/policies')
        .send(policy);

      
      const response = await request(app)
        .get('/policies/t-test-02')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toMatchObject(policy);
    });

    it('should return empty array for tenant with no policies', async () => {
      const response = await request(app)
        .get('/policies/non-existent-tenant')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /evaluate', () => {
    beforeEach(async () => {
    
      await request(app)
        .post('/policies')
        .send({
          tenantId: 't-eval-01',
          scope: 'TENANT',
          algorithm: 'SLIDING_WINDOW',
          limit: 5,
          windowSeconds: 60
        });
    });

    it('should allow requests within limit', async () => {
      const response = await request(app)
        .post('/evaluate')
        .send({
          tenantId: 't-eval-01',
          route: '/test'
        })
        .expect(200);

      expect(response.body.allow).toBe(true);
      expect(response.body.remaining).toBeLessThanOrEqual(5);
      expect(response.headers['x-ratelimit-limit']).toBe('5');
    });

    it('should block requests exceeding limit', async () => {
     
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/evaluate')
          .send({
            tenantId: 't-eval-02-block',
            route: '/test'
          });
      }

      
      await request(app)
        .post('/policies')
        .send({
          tenantId: 't-eval-02-block',
          scope: 'TENANT',
          algorithm: 'SLIDING_WINDOW',
          limit: 5,
          windowSeconds: 60
        });

      
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/evaluate')
          .send({
            tenantId: 't-eval-02-block',
            route: '/test'
          });
      }

      
      const response = await request(app)
        .post('/evaluate')
        .send({
          tenantId: 't-eval-02-block',
          route: '/test'
        })
        .expect(200);

      expect(response.body.allow).toBe(false);
      expect(response.body.remaining).toBe(0);
    });

    it('should return 404 for tenant without policy', async () => {
      await request(app)
        .post('/evaluate')
        .send({
          tenantId: 'non-existent',
          route: '/test'
        })
        .expect(404);
    });

    it('should return 400 for missing parameters', async () => {
      await request(app)
        .post('/evaluate')
        .send({
          tenantId: 't-eval-01'
         
        })
        .expect(400);
    });

    it('should set correct rate limit headers', async () => {
      const response = await request(app)
        .post('/evaluate')
        .send({
          tenantId: 't-eval-01',
          route: '/test'
        });

      expect(response.headers['x-ratelimit-limit']).toBeDefined();
      expect(response.headers['x-ratelimit-remaining']).toBeDefined();
      expect(response.headers['x-ratelimit-reset']).toBeDefined();
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});
