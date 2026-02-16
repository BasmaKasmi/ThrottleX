# Runbook ThrottleX

## Déploiement

### Local

```bash
npm install
npm start
# API sur http://localhost:3000
```

### Docker

```bash
docker build -t throttlex .
docker run -p 3000:3000 throttlex
```

## Rollback

```bash
git revert HEAD
npm install
npm start
```

## Incidents

### API lente (p95 > 100ms)

**Actions :**

1. Vérifier CPU : `top`
2. Vérifier RAM : `free -m`
3. Redémarrer : `npm restart`

### Taux d'erreur > 1%

**Actions :**

1. Logs : `tail -100 logs/app.log`
2. Si bug récent → Rollback
3. Si surcharge → Scale

### Mémoire pleine

**Actions :**

1. Restart : `npm restart`
2. Nettoyer compteurs expirés

## Monitoring

**Métriques :**

- p95 < 50ms
- Erreurs < 0.1%
- RAM < 500MB
