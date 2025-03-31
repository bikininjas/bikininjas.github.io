# Blog Next.js

Ce projet est un blog développé avec [Next.js](https://nextjs.org/), qui utilise des fichiers Markdown pour le contenu des articles et intègre des fonctionnalités modernes comme les embeds Twitter et Bluesky.

## Fonctionnalités

- Rendu de contenu Markdown en HTML
- Support des catégories d'articles
- Intégration d'embeds sociaux (Twitter, Bluesky)
- Interface responsive avec effets de parallaxe
- Tests automatisés complets

## Installation

```bash
# Installer les dépendances
bun install

# Démarrer le serveur de développement
bun run dev
```

Le site sera accessible à l'adresse [http://localhost:3000](http://localhost:3000).

## Structure du projet

- `/components` - Composants React réutilisables
- `/lib` - Fonctions utilitaires
- `/pages` - Pages du site
- `/posts` - Articles en Markdown
- `/public` - Fichiers statiques
- `/styles` - Feuilles de style CSS
- `/tests` - Tests unitaires et d'intégration

## Tests

Pour plus d'informations sur la gestion des tests, comment les modifier et en ajouter, consultez le [guide des tests](./TESTS.md).

## Résultats des tests

### Tests unitaires

```bash
PASS  tests/unit/deadcode.test.js
PASS  tests/unit/layout.test.js
PASS  tests/unit/posts.test.js

Test Suites: 3 passed, 3 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        1.463 s
```

### Tests Cypress (E2E)

```text
(Run Finished)

       Spec                                              Tests  Passing  Failing  Pending  Skipped  
  ┌────────────────────────────────────────────────────────────────────────────────────────────────┐
  │ ✔  blog.cy.js                               00:05        4        4        -        -        - │
  └────────────────────────────────────────────────────────────────────────────────────────────────┘
    ✔  All specs passed!                        00:05        4        4        -        -        -  
```

### Tests Playwright

```text
Running 4 tests using 4 workers
[4/4] [chromium] › playwright/tests/navigation.spec.js:41:3 › Navigation Tests › should load Bluesky embeds
  4 passed (3.8s)
```

## Scripts disponibles

- `bun run dev` - Démarre le serveur de développement
- `bun run build` - Construit l'application pour la production
- `bun run start` - Démarre l'application en mode production
- `bun run test:unit` - Exécute les tests unitaires
- `bun run test:e2e:headless` - Exécute les tests Cypress en mode headless
- `bun run test:playwright` - Exécute les tests Playwright
- `bun run test:all` - Exécute tous les tests (unitaires, Cypress et Playwright)

## Déploiement

Le projet est configuré pour être déployé via GitHub Actions. Les tests sont exécutés automatiquement à chaque push sur la branche principale.
