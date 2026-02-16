# ADR-001: In-Memory avec Node.js

## Décision

On choisit In-Memory car :

- Ultra-rapide (< 1ms)
- Gratuit
- Simple à coder en 2 jours

## Risques

- Perte de données si crash (OK pour MVP)
- Pas de HA (OK pour MVP)

## Solution v2

Si besoin : migrer vers Redis plus tard
