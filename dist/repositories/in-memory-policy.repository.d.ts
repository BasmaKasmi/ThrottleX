import { Policy } from '../models/policy.model';
import { IPolicyRepository } from './policy.repository.interface';
export declare class InMemoryPolicyRepository implements IPolicyRepository {
    private policies;
    private generateKey;
    create(policy: Policy): Promise<Policy>;
    findByTenantId(tenantId: string): Promise<Policy[]>;
    findByTenantAndRoute(tenantId: string, route?: string): Promise<Policy | null>;
    update(tenantId: string, route: string | undefined, policy: Policy): Promise<Policy>;
    delete(tenantId: string, route?: string): Promise<boolean>;
}
//# sourceMappingURL=in-memory-policy.repository.d.ts.map