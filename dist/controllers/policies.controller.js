"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PoliciesController = void 0;
class PoliciesController {
    policyRepo;
    constructor(policyRepo) {
        this.policyRepo = policyRepo;
    }
    async create(req, res) {
        try {
            const policy = req.body;
            // Validation basique
            if (!policy.tenantId || !policy.limit || !policy.windowSeconds) {
                res.status(400).json({ error: 'Missing required fields' });
                return;
            }
            const created = await this.policyRepo.create(policy);
            res.status(201).json(created);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getByTenantId(req, res) {
        try {
            const { tenantId } = req.params;
            const tenantIdString = Array.isArray(tenantId) ? tenantId[0] : tenantId;
            if (!tenantIdString) {
                res.status(400).json({ error: 'Invalid tenantId' });
                return;
            }
            const policies = await this.policyRepo.findByTenantId(tenantIdString);
            res.status(200).json(policies);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.PoliciesController = PoliciesController;
//# sourceMappingURL=policies.controller.js.map