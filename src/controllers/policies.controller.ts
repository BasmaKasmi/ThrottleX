import { Request, Response } from 'express';
import { IPolicyRepository } from '../repositories/policy.repository.interface';
import { Policy } from '../models/policy.model';

export class PoliciesController {
  constructor(private policyRepo: IPolicyRepository) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const policy: Policy = req.body;
      
      // Validation basique
      if (!policy.tenantId || !policy.limit || !policy.windowSeconds) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const created = await this.policyRepo.create(policy);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getByTenantId(req: Request, res: Response): Promise<void> {
    try {
      const { tenantId } = req.params;
      
    
      const tenantIdString = Array.isArray(tenantId) ? tenantId[0] : tenantId;
      
      if (!tenantIdString) {
        res.status(400).json({ error: 'Invalid tenantId' });
        return;
      }
      
      const policies = await this.policyRepo.findByTenantId(tenantIdString);
      res.status(200).json(policies);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}