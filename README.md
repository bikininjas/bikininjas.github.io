# Blog Personnel

Blog personnel construit avec Next.js et déployé sur GitHub Pages.

## Technologies Utilisées

- [Next.js](https://nextjs.org/) - Framework React pour la production
- [TypeScript](https://www.typescriptlang.org/) - Pour le typage statique
- [Tailwind CSS](https://tailwindcss.com/) - Pour le styling
- [MDX](https://mdxjs.com/) - Pour écrire les articles en Markdown
- [Jest](https://jestjs.io/) - Pour les tests unitaires

## Fonctionnalités

- Site statique généré avec `next export`
- Support du mode sombre/clair
- Optimisation des images avec next/image
- Posts en Markdown avec MDX
- Système de métadonnées pour les articles
- Intégration continue avec GitHub Actions

## Structure du Projet

```
.
├── components/     # Composants React réutilisables
├── lib/           # Utilitaires et fonctions d'aide
├── pages/         # Pages de l'application Next.js
├── posts/         # Articles de blog en markdown
├── public/        # Assets statiques
├── styles/        # Feuilles de style CSS
└── tests/         # Tests unitaires
```

## Installation

```bash
# Cloner le projet
git clone https://github.com/bikininjas/bikininjas.github.io.git
cd bikininjas.github.io

# Installer les dépendances
npm install

# Lancer en développement
npm run dev
```

## Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Construit le projet pour la production
- `npm run export` - Exporte le site en statique
- `npm test` - Lance les tests
- `npm run lint` - Vérifie le code avec ESLint

## Déploiement

Le site est automatiquement déployé sur GitHub Pages via GitHub Actions lorsqu'un push est effectué sur la branche main.

## Licence

MIT
