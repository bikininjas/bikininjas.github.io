# Guide des tests

Ce document explique comment sont gérés les tests dans le projet, comment les modifier et comment en ajouter de nouveaux.

## Types de tests

Le projet utilise trois types de tests :

1. **Tests unitaires** (Jest)
2. **Tests end-to-end** (Cypress)
3. **Tests d'intégration** (Playwright)

## Tests unitaires (Jest)

Les tests unitaires sont situés dans le dossier `tests/unit/` et utilisent Jest comme framework de test.

### Exécution des tests unitaires

```bash
bun run test:unit
```

### Structure des tests unitaires

- `tests/unit/layout.test.js` - Tests pour le composant Layout
- `tests/unit/posts.test.js` - Tests pour les fonctions de gestion des articles
- `tests/unit/deadcode.test.js` - Tests pour détecter le code mort

### Ajouter un nouveau test unitaire

1. Créez un nouveau fichier dans le dossier `tests/unit/` avec le suffixe `.test.js`
2. Importez les composants ou fonctions à tester
3. Utilisez les fonctions de Jest (`describe`, `it`, `expect`) pour écrire vos tests

Exemple :

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Tests end-to-end (Cypress)

Les tests end-to-end sont situés dans le dossier `cypress/e2e/` et utilisent Cypress comme framework de test.

### Exécution des tests Cypress

```bash
# Mode headless (pour CI/CD)
bun run test:e2e:headless

# Mode interactif
bun run test:e2e:open
```

### Structure des tests Cypress

- `cypress/e2e/blog.cy.js` - Tests de navigation et d'affichage du blog

### Ajouter un nouveau test Cypress

1. Créez un nouveau fichier dans le dossier `cypress/e2e/` avec le suffixe `.cy.js`
2. Utilisez les fonctions de Cypress (`describe`, `it`, `cy`) pour écrire vos tests

Exemple :

```javascript
describe('Feature Tests', () => {
  it('should perform an action', () => {
    cy.visit('/path');
    cy.get('selector').click();
    cy.get('result-selector').should('be.visible');
  });
});
```

### Configuration de Cypress

La configuration de Cypress se trouve dans le fichier `cypress.config.js` à la racine du projet. Vous pouvez y modifier :

- L'URL de base pour les tests (`baseUrl`)
- Les options de lancement du navigateur
- Les plugins et autres configurations

## Tests d'intégration (Playwright)

Les tests d'intégration sont situés dans le dossier `playwright/tests/` et utilisent Playwright comme framework de test.

### Exécution des tests Playwright

```bash
# Mode headless (pour CI/CD)
bun run test:playwright

# Mode interactif avec UI
bun run test:playwright:ui
```

### Structure des tests Playwright

- `playwright/tests/navigation.spec.js` - Tests de navigation et d'intégration

### Ajouter un nouveau test Playwright

1. Créez un nouveau fichier dans le dossier `playwright/tests/` avec le suffixe `.spec.js`
2. Utilisez les fonctions de Playwright (`test`, `expect`) pour écrire vos tests

Exemple :

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Tests', () => {
  test('should perform an action', async ({ page }) => {
    await page.goto('/path');
    await page.click('selector');
    await expect(page.locator('result-selector')).toBeVisible();
  });
});
```

### Configuration de Playwright

La configuration de Playwright se trouve dans le fichier `playwright.config.js` à la racine du projet. Vous pouvez y modifier :

- Les navigateurs à utiliser pour les tests
- Les timeouts et autres paramètres
- Les rapports et captures d'écran

## Bonnes pratiques

1. **Isolation** : Chaque test doit être indépendant des autres tests
2. **Sélecteurs robustes** : Utilisez des sélecteurs qui ne changent pas fréquemment
3. **Tests significatifs** : Testez des comportements, pas des implémentations
4. **Couverture de code** : Visez une bonne couverture de code, mais privilégiez la qualité à la quantité

## Résolution des problèmes courants

### Tests qui échouent en mode headless mais pas en mode interactif

- Vérifiez les timeouts (les éléments peuvent prendre plus de temps à charger en mode headless)
- Vérifiez si des éléments ne sont visibles qu'après une interaction utilisateur
- Assurez-vous que les sélecteurs sont corrects et robustes

### Erreurs "Element not found"

- Vérifiez que les sélecteurs correspondent à la structure HTML actuelle
- Utilisez des attentes explicites (`cy.wait()`, `page.waitForSelector()`)
- Vérifiez si l'élément est dans un iframe ou un shadow DOM

## Intégration avec SonarQube

Le projet est configuré pour s'intégrer avec SonarQube Cloud afin de surveiller la qualité du code et la couverture des tests.

### Configuration SonarQube

La configuration SonarQube se trouve dans le fichier `sonar-project.properties` à la racine du projet. Cette configuration inclut :

- L'organisation et la clé du projet
- Les chemins des sources et des tests
- Les exclusions pour l'analyse
- Les chemins des rapports de couverture
- Les paramètres de Quality Gate

### Exécution de l'analyse SonarQube

L'analyse SonarQube est automatiquement exécutée dans les workflows GitHub Actions. Vous pouvez également l'exécuter localement :

```bash
# Préparer les rapports pour SonarQube
bun run sonar:prepare

# Exécuter l'analyse SonarQube localement (nécessite sonar-scanner)
bun run sonar:local
```

### Quality Gate

Le projet utilise un Quality Gate SonarQube avec les critères suivants :

- Couverture de code minimale : 70%
- Duplication de code maximale : 5%
- Dette technique maximale : 5%
- Bugs critiques : 0
- Vulnérabilités de sécurité : 0

### Amélioration de la couverture de code

Pour améliorer la couverture de code et passer le Quality Gate, suivez ces bonnes pratiques :

1. **Ajouter des tests pour le code non couvert** :

   ```bash
   # Voir un résumé de la couverture actuelle
   bun run coverage:summary
   ```

2. **Identifier les fichiers à faible couverture** :
   - Consultez le rapport de couverture dans `coverage/lcov-report/index.html`
   - Concentrez-vous sur les fichiers avec une couverture inférieure à 70%

3. **Tester les branches conditionnelles** :
   - Assurez-vous de tester les deux côtés des instructions if/else
   - Testez les cas limites et les exceptions

4. **Utiliser les seuils de couverture** :
   - Le projet est configuré avec un seuil de couverture de 70% dans `jest.config.js`
   - Les tests échoueront si la couverture tombe en dessous de ce seuil

## Rapports de tests

Le projet est configuré pour générer des rapports détaillés pour tous les types de tests :

### Rapports Jest (tests unitaires)

Les tests unitaires génèrent des rapports de couverture de code au format LCOV et des rapports de test au format JUnit XML :

```bash
bun run test:coverage
```

Les rapports sont générés dans les dossiers suivants :
- Couverture de code : `coverage/`
- Rapports de test : `test-reports/junit.xml`

### Rapports Cypress (tests end-to-end)

Les tests Cypress génèrent des rapports au format Mochawesome et JUnit XML :

```bash
bun run test:e2e:report
```

Les rapports sont générés dans les dossiers suivants :
- Rapports Mochawesome : `cypress/reports/mochawesome/`
- Rapports JUnit : `cypress/reports/junit/`
- Captures d'écran (en cas d'échec) : `cypress/screenshots/`
- Vidéos : `cypress/videos/`

### Rapports Playwright (tests d'intégration)

Les tests Playwright génèrent des rapports HTML, JUnit XML et JSON :

```bash
bun run test:playwright
```

Les rapports sont générés dans les dossiers suivants :
- Rapports HTML : `playwright-report/`
- Rapports JUnit : `test-reports/playwright-results.xml`
- Rapports JSON : `test-reports/playwright-results.json`
- Traces et captures d'écran : `test-results/`

## Intégration continue et rapports automatisés

Les workflows GitHub Actions sont configurés pour exécuter tous les tests et générer des rapports à chaque push :

1. **Workflow de test** (`test.yml`) :
   - S'exécute sur toutes les branches sauf master et main
   - Exécute tous les types de tests
   - Génère des rapports de couverture
   - Effectue l'analyse SonarQube
   - Publie un rapport détaillé en commentaire sur la PR ou le commit

2. **Workflow de déploiement** (`deploy-blog.yml`) :
   - S'exécute sur les branches master et main
   - Exécute les tests unitaires avant le déploiement
   - Déploie le blog sur GitHub Pages

### Rapport de test automatisé

Après chaque exécution du workflow de test, un rapport détaillé est automatiquement publié en commentaire, incluant :

- Résultats des tests unitaires
- Couverture de code
- Résultats des tests Cypress
- Résultats des tests Playwright

Ce rapport vous permet de voir rapidement si vos modifications ont amélioré ou dégradé la qualité du code et la couverture des tests.

## Intégration SonarCloud

Le projet est configuré pour envoyer les résultats des tests et les rapports de couverture de code à SonarCloud, une plateforme d'analyse continue de la qualité du code.

### Configuration SonarCloud

La configuration de SonarCloud se trouve dans le fichier `sonar-project.properties` à la racine du projet.

### Exécution de l'analyse SonarCloud localement

Pour exécuter l'analyse SonarCloud localement avant de pousser vos modifications :

1. Installez SonarScanner
2. Exécutez les tests avec couverture : `bun run test:sonar`
3. Exécutez SonarScanner : `sonar-scanner`

### Visualisation des résultats

Les résultats de l'analyse sont disponibles sur le tableau de bord SonarCloud du projet : https://sonarcloud.io/project/overview?id=bikininjas_bikininjas.github.io

## Intégration CI/CD

Les tests sont automatiquement exécutés dans GitHub Actions à chaque push. La configuration se trouve dans le fichier `.github/workflows/test.yml`.

Le workflow CI/CD effectue les étapes suivantes :

1. Exécution des tests unitaires avec couverture de code
2. Exécution des tests Cypress en mode headless
3. Exécution des tests Playwright
4. Analyse SonarCloud
5. Publication des rapports et artefacts

Pour que les tests passent en CI/CD, assurez-vous qu'ils fonctionnent en mode headless localement avant de pousser vos modifications.
