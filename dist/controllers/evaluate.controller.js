"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvaluateController = void 0;
class EvaluateController {
    policyRepo;
    rateLimiter;
    constructor(policyRepo, rateLimiter) {
        this.policyRepo = policyRepo;
        this.rateLimiter = rateLimiter;
    }
    async evaluate(req, res) {
        try {
            const { tenantId, route } = req.body;
            if (!tenantId || !route) {
                res.status(400).json({ error: 'Missing tenantId or route' });
                return;
            }
            const policy = await this.policyRepo.findByTenantAndRoute(tenantId, route);
            if (!policy) {
                res.status(404).json({ error: 'No policy found for this tenant' });
                return;
            }
            // Evaluate rate limit
            const result = await this.rateLimiter.evaluate(tenantId, route, policy.limit, policy.windowSeconds);
            // Set headers
            res.setHeader('X-RateLimit-Limit', policy.limit.toString());
            res.setHeader('X-RateLimit-Remaining', result.remaining.toString());
            res.setHeader('X-RateLimit-Reset', result.resetAt.toString());
            // Return response
            res.status(200).json({
                allow: result.allowed,
                remaining: result.remaining,
                resetAt: result.resetAt
            });
        }
        catch (error) {
            console.error('Evaluate error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.EvaluateController = EvaluateController;
//# sourceMappingURL=evaluate.controller.js.map