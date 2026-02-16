export declare enum Algorithm {
    SLIDING_WINDOW = "SLIDING_WINDOW",
    TOKEN_BUCKET = "TOKEN_BUCKET"
}
export declare enum Scope {
    TENANT = "TENANT",
    TENANT_ROUTE = "TENANT_ROUTE"
}
export interface Policy {
    tenantId: string;
    route?: string;
    scope: Scope;
    algorithm: Algorithm;
    limit: number;
    windowSeconds: number;
    burst?: number;
    ttlSeconds?: number;
}
//# sourceMappingURL=policy.model.d.ts.map