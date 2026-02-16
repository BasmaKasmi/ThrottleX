import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { InMemoryPolicyRepository } from './repositories/in-memory-policy.repository';
import { SlidingWindowRateLimiter } from './services/sliding-window.service';
import { PoliciesController } from './controllers/policies.controller';
import { EvaluateController } from './controllers/evaluate.controller';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  // Repositories & Services
  const policyRepo = new InMemoryPolicyRepository();
  const rateLimiter = new SlidingWindowRateLimiter();

  // Controllers
  const policiesController = new PoliciesController(policyRepo);
  const evaluateController = new EvaluateController(policyRepo, rateLimiter);

  // Routes
  app.post('/policies', (req, res) => policiesController.create(req, res));
  app.get('/policies/:tenantId', (req, res) => policiesController.getByTenantId(req, res));
  app.post('/evaluate', (req, res) => evaluateController.evaluate(req, res));

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  return app;
}