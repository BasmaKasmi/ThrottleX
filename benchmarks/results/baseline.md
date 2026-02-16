# Benchmark Baseline - V0 (Option B In-Memory)

**Date** : 2026-02-10  
**Commit** : V0 Initial  
**Architecture** : Option B (In-Memory + Sliding Window)  
**Environnement** : MacBook Pro (local)

---

## Résultats

| Métrique | Valeur | Objectif | Statut |
|----------|--------|----------|--------|
| **p50** | 0.945ms | < 10ms | **10.5x mieux** |
| **p90** | 3.2ms | - | Excellent |
| **p95** | 4.16ms | < 50ms | **12x mieux** |
| **p99** | ~15-20ms (estimé) | < 100ms | Excellent |
| **Max** | 20.17ms | < 100ms | |
| **Throughput** | 921 req/s | - | |
| **Taux d'erreur** | 0% | < 1% | Parfait |
| **Taux de succès** | 100% | > 99% | |

---

## Analyse

### Points forts
- **Latence ultra-faible** : p95 = 4.16ms (12x mieux que l'objectif de 50ms)
- **Aucune erreur** : 110 601 requêtes traitées sans erreur serveur
- **Option B validée** : In-Memory offre des performances exceptionnelles
- **Rate limiting fonctionnel** : Les limites sont respectées

### Scénario de test
- **VUs** : Montée progressive de 10 → 50 → 100 → 200 utilisateurs virtuels
- **Durée** : 2 minutes
- **Requêtes totales** : 110 601
- **Tenants testés** : t-free-01 (60/min), t-pro-01 (600/min), t-ent-01 (3000/min)

### Observations
- Le throughput de 921 req/s est **limité volontairement** par le rate limiting
- Les requêtes bloquées (`allow=false`) répondent aussi rapidement que les autorisées
- Aucun goulot d'étranglement détecté
- La latence reste stable même à 200 VUs

---

## �� Prochaines optimisations (si nécessaire)

Bien que les résultats soient déjà excellents, voici des pistes d'amélioration potentielles :

1. **Cache des policies** : Éviter la lookup à chaque requête
2. **Batch cleanup** : Nettoyer les timestamps expirés par batch
3. **Profiling V8** : Optimiser les hotspots avec `--prof`

**Verdict** : Aucune optimisation urgente nécessaire. Les performances dépassent largement les objectifs.

---

## Commande de reproduction
```bash
# Créer les policies
curl -X POST http://localhost:3000/policies -H "Content-Type: application/json" \
  -d '{"tenantId":"t-free-01","scope":"TENANT","algorithm":"SLIDING_WINDOW","limit":60,"windowSeconds":60}'

curl -X POST http://localhost:3000/policies -H "Content-Type: application/json" \
  -d '{"tenantId":"t-pro-01","scope":"TENANT","algorithm":"SLIDING_WINDOW","limit":600,"windowSeconds":60}'

curl -X POST http://localhost:3000/policies -H "Content-Type: application/json" \
  -d '{"tenantId":"t-ent-01","scope":"TENANT","algorithm":"SLIDING_WINDOW","limit":3000,"windowSeconds":60}'

# Lancer le benchmark
k6 run benchmarks/k6/throttlex_load_test.js
```

---


**Date** : 2026-02-10
