import { Policy } from '../models/policy.model';
export interface IPolicyRepository {
    create(policy: Policy): Promise<Policy>;
    findByTenantId(tenantId: string): Promise<Policy[]>;
    findByTenantAndRoute(tenantId: string, route?: string): Promise<Policy | null>;
    update(tenantId: string, route: string | undefined, policy: Policy): Promise<Policy>;
    delete(tenantId: string, route?: string): Promise<boolean>;
}
//# sourceMappingURL=policy.repository.interface.d.ts.map