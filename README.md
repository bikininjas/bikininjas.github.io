# BikiNinjas Blog

A modern blog built with Next.js and hosted on GitHub Pages, featuring content about society, mental health, video games, programming, game development, and modding games.

## Features

- 🔥 Next.js for Static Site Generator
- 🎨 Tailwind CSS for styling
- 💅 PostCSS for processing Tailwind CSS
- 🎉 TypeScript for type checking
- ✅ Strict Mode for TypeScript and React 18
- ✏️ ESLint with NextJS, NextJS Core Web Vitals, and Airbnb configuration
- 🛠 Prettier for code formatting
- 🦊 Husky for Git Hooks
- 🚫 Lint-staged for running linters on Git staged files
- 🗂 VSCode configuration
- 🤖 SEO optimization with Next SEO
- 📝 Markdown-based blog posts

## Blog Categories

- Society
- Mental health
- Video games
- Programming
- Game development
- Modding games

## Getting Started

### Prerequisites

- Node.js (version 18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bikininjas/bikininjas.github.io.git
   cd bikininjas.github.io
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Creating Blog Posts

Blog posts are written in Markdown and stored in the `_posts` directory. Each post should include a YAML front matter with the following fields:

```markdown
---
title: 'Post Title'
excerpt: 'Brief description of the post'
coverImage: '/assets/blog/example/cover.jpg'
date: '2025-03-10T05:35:07.322Z'
author:
  name: Author Name
  picture: '/assets/blog/authors/profile.jpg'
ogImage:
  url: '/assets/blog/example/cover.jpg'
category: 'Category Name'
---

Post content in Markdown...
```

## Building for Production

To build the site for production:

```bash
npm run build
# or
yarn build
```

This will generate a static export in the `out` directory that can be deployed to GitHub Pages.

## Deployment

The site is automatically deployed to GitHub Pages when changes are pushed to the master branch, using the GitHub Actions workflow defined in `.github/workflows/deploy-docs.yml`.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/)
- [Next SEO](https://github.com/garmeeh/next-seo)
