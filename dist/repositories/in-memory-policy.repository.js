"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryPolicyRepository = void 0;
class InMemoryPolicyRepository {
    policies = new Map();
    generateKey(tenantId, route) {
        return route ? `${tenantId}:${route}` : `${tenantId}:*`;
    }
    async create(policy) {
        const key = this.generateKey(policy.tenantId, policy.route);
        this.policies.set(key, policy);
        return policy;
    }
    async findByTenantId(tenantId) {
        const results = [];
        this.policies.forEach((policy, key) => {
            if (key.startsWith(`${tenantId}:`)) {
                results.push(policy);
            }
        });
        return results;
    }
    async findByTenantAndRoute(tenantId, route) {
        const exactKey = this.generateKey(tenantId, route);
        const exactMatch = this.policies.get(exactKey);
        if (exactMatch)
            return exactMatch;
        // Fallback to tenant-wide policy
        const fallbackKey = this.generateKey(tenantId);
        return this.policies.get(fallbackKey) || null;
    }
    async update(tenantId, route, policy) {
        const key = this.generateKey(tenantId, route);
        this.policies.set(key, policy);
        return policy;
    }
    async delete(tenantId, route) {
        const key = this.generateKey(tenantId, route);
        return this.policies.delete(key);
    }
}
exports.InMemoryPolicyRepository = InMemoryPolicyRepository;
//# sourceMappingURL=in-memory-policy.repository.js.map