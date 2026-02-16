import { Request, Response } from 'express';
import { IPolicyRepository } from '../repositories/policy.repository.interface';
import { IRateLimiter } from '../services/rate-limiter.interface';
export declare class EvaluateController {
    private policyRepo;
    private rateLimiter;
    constructor(policyRepo: IPolicyRepository, rateLimiter: IRateLimiter);
    evaluate(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=evaluate.controller.d.ts.map