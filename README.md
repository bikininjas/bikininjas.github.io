# Blog Personnel

Blog personnel construit avec Astro et déployé sur GitHub Pages.

## Technologies Utilisées

- [Astro](https://astro.build/) - Framework moderne pour sites statiques
- [TypeScript](https://www.typescriptlang.org/) - Pour le typage statique
- [Tailwind CSS](https://tailwindcss.com/) - Pour le styling
- [Svelte](https://svelte.dev/) - Pour les composants interactifs
- [React](https://reactjs.org/) - Pour certains composants (Calendar)
- [Markdown](https://www.markdownguide.org/) - Pour écrire les articles

## Fonctionnalités

- Site statique généré avec Astro
- Support du mode sombre/clair
- Optimisation des images automatique
- Posts en Markdown avec frontmatter
- Système de métadonnées pour les articles
- Recherche intégrée avec Pagefind
- Navigation fluide avec Swup
- Support multilingue
- Intégration calendrier
- Intégration continue avec GitHub Actions

## Structure du Projet

```
.
├── yukina-blog/          # Application Astro principale
│   ├── src/
│   │   ├── components/   # Composants Astro, Svelte et React
│   │   ├── contents/     # Articles et contenu
│   │   ├── layouts/      # Layouts de page
│   │   ├── pages/        # Pages de l'application
│   │   ├── styles/       # Feuilles de style CSS
│   │   └── utils/        # Utilitaires et fonctions d'aide
│   ├── public/           # Assets statiques
│   └── dist/            # Build de production
├── calendar-app/         # Application calendrier standalone
└── pages/               # Pages additionnelles
```

## Installation

```bash
# Cloner le projet
git clone https://github.com/bikininjas/bikininjas.github.io.git
cd bikininjas.github.io

# Aller dans le dossier du blog
cd yukina-blog

# Installer les dépendances avec bun
bun install

# Lancer en développement
bun run dev
```

## Scripts Disponibles

- `bun run dev` - Lance le serveur de développement
- `bun run build` - Construit le projet pour la production
- `bun run preview` - Prévisualise le build de production

## Déploiement

Le site est automatiquement déployé sur GitHub Pages via GitHub Actions lorsqu'un push est effectué sur la branche main.

## Licence

MIT
