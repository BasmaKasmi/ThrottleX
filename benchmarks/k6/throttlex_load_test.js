import http from 'k6/http';
import { sleep, check } from 'k6';

// Configure via env vars:
// BASE_URL (ThrottleX base, e.g. http://localhost:8080)
// TENANTS (comma-separated, e.g. t-free-01,t-pro-01,t-ent-01)
// ROUTE (e.g. /inference/text)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const TENANTS = (__ENV.TENANTS || 't-free-01,t-pro-01,t-ent-01').split(',');
const ROUTE = __ENV.ROUTE || '/inference/text';

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 200 },
    { duration: '30s', target: 0 },
  ]
};

export default function () {
  const tenant = TENANTS[Math.floor(Math.random() * TENANTS.length)];
  const res = http.post(`${BASE_URL}/evaluate`, JSON.stringify({ tenantId: tenant, route: ROUTE }), {
    headers: { 'Content-Type': 'application/json' }
  });
  check(res, { 'status 200': r => r.status === 200 });
  sleep(0.1);
}
