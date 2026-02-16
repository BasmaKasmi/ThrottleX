import { Policy } from '../models/policy.model';
import { IPolicyRepository } from './policy.repository.interface';

export class InMemoryPolicyRepository implements IPolicyRepository {
  private policies: Map<string, Policy> = new Map();

  private generateKey(tenantId: string, route?: string): string {
    return route ? `${tenantId}:${route}` : `${tenantId}:*`;
  }

  async create(policy: Policy): Promise<Policy> {
    const key = this.generateKey(policy.tenantId, policy.route);
    this.policies.set(key, policy);
    return policy;
  }

  async findByTenantId(tenantId: string): Promise<Policy[]> {
    const results: Policy[] = [];
    this.policies.forEach((policy, key) => {
      if (key.startsWith(`${tenantId}:`)) {
        results.push(policy);
      }
    });
    return results;
  }

  async findByTenantAndRoute(tenantId: string, route?: string): Promise<Policy | null> {
   
    const exactKey = this.generateKey(tenantId, route);
    const exactMatch = this.policies.get(exactKey);
    if (exactMatch) return exactMatch;

    // Fallback to tenant-wide policy
    const fallbackKey = this.generateKey(tenantId);
    return this.policies.get(fallbackKey) || null;
  }

  async update(tenantId: string, route: string | undefined, policy: Policy): Promise<Policy> {
    const key = this.generateKey(tenantId, route);
    this.policies.set(key, policy);
    return policy;
  }

  async delete(tenantId: string, route?: string): Promise<boolean> {
    const key = this.generateKey(tenantId, route);
    return this.policies.delete(key);
  }
}