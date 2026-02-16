# Roadmap ThrottleX

## Année 1 (2025)

**Q1-Q2 :** MVP + CI/CD + Monitoring
**Q3-Q4 :** Migration Redis si > 1000 tenants

**Objectif :** 500 tenants, 10k RPS, 99.9% uptime

---

## Année 2 (2026)

**Q1-Q2 :** Quotas par user, Webhooks
**Q3-Q4 :** Analytics temps réel, SDK

**Objectif :** 2k tenants, 50k RPS

---

## Année 3 (2027)

**Q1-Q2 :** ML détection anomalies
**Q3-Q4 :** Kubernetes, Multi-cloud

**Objectif :** 10k tenants, 100k RPS

---

## Années 4-5 (2028-2029)

**Enterprise :** SOC2, Support 24/7, SLA 99.99%

**Objectif :** 50k tenants, 1M RPS

---

## Stack Evolution

| Année | Backend   | Storage   | Deploy      |
| ----- | --------- | --------- | ----------- |
| 2025  | Node.js   | In-Memory | Docker      |
| 2027  | Node+Go   | Redis     | Kubernetes  |
| 2029  | Node+Rust | ScyllaDB  | Multi-cloud |
