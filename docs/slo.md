# SLO (Service Level Objectives) - ThrottleX

## Objectifs de Service

| Métrique          | Cible      | Budget d'erreur         |
| ----------------- | ---------- | ----------------------- |
| **p95 latency**   | < 50ms     | 5% peuvent dépasser     |
| **p99 latency**   | < 100ms    | 1% peuvent dépasser     |
| **Disponibilité** | ≥ 99.9%    | 43 min downtime/mois    |
| **Taux d'erreur** | < 0.1%     | 1000 erreurs sur 1M req |
| **Throughput**    | > 1000 RPS | N/A                     |

## Calcul Budget d'Erreur

### Disponibilité 99.9%

```
30 jours × 24h × 60min = 43 200 minutes/mois
Budget = 0.1% × 43 200 = 43.2 minutes downtime MAX
```

### Taux d'erreur 0.1%

```
Si 1 000 000 requêtes/mois
→ MAX 1000 erreurs autorisées
```

## Actions selon budget consommé

| Consommé | Action                  |
| -------- | ----------------------- |
| 0-50%    | Normal, déploiements OK |
| 50-80%   | Ralentir déploiements   |
| 80-100%  | STOP déploiements       |
| > 100%   | Post-mortem obligatoire |
