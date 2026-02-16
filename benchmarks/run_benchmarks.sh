#!/bin/bash
# Script pour lancer le benchmark ThrottleX

echo "🔹 Démarrage du serveur..."
npm run start &
SERVER_PID=$!
sleep 2

echo "🔹 Création des policies pour les tenants..."
curl -s -X POST http://localhost:3000/policies -H "Content-Type: application/json" \
  -d '{"tenantId":"t-free-01","scope":"TENANT","algorithm":"SLIDING_WINDOW","limit":60,"windowSeconds":60}'

curl -s -X POST http://localhost:3000/policies -H "Content-Type: application/json" \
  -d '{"tenantId":"t-pro-01","scope":"TENANT","algorithm":"SLIDING_WINDOW","limit":600,"windowSeconds":60}'

curl -s -X POST http://localhost:3000/policies -H "Content-Type: application/json" \
  -d '{"tenantId":"t-ent-01","scope":"TENANT","algorithm":"SLIDING_WINDOW","limit":3000,"windowSeconds":60}'

echo "🔹 Lancement du benchmark k6..."
k6 run benchmarks/k6/throttlex_load_test.js

echo "🔹 Arrêt du serveur..."
kill $SERVER_PID
