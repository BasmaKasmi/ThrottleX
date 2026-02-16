# CI — Quality Gates (checklist)

- **Lint** du langage choisi (lint stage non bloquant au début, **bloquant** ensuite).
- **Tests** unitaires + intégration + **tests de propriétés** ; **couverture ≥ 80 %** sur le domaine.
- **Analyse statique** (SAST léger) + **audit des dépendances** (fail si HIGH/CRITICAL non justifiés).
- **SBOM** générée (CycloneDX) et publiée comme artefact.
- **Image** (si conteneur) scannée avant release.
- **Bench** reproductible (scripts/k6) — publier p95/p99/throughput “avant → après”.
- **Release** versionnée + changelog.
