import { Request, Response } from 'express';
import { IPolicyRepository } from '../repositories/policy.repository.interface';
export declare class PoliciesController {
    private policyRepo;
    constructor(policyRepo: IPolicyRepository);
    create(req: Request, res: Response): Promise<void>;
    getByTenantId(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=policies.controller.d.ts.map