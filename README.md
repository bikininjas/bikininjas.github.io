# Next.js Markdown Blog

A modern, customizable blog platform built with Next.js and Markdown. Perfect for creating a personal blog about gaming, technology, AI, and more. This blog features a clean, responsive design with a parallax scrolling effect, category navigation, and beautiful post cards with background images.

![Blog Preview](https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=1200&q=80)

## 🌟 Features

- **Easy Content Management**: Write blog posts in Markdown with simple frontmatter
- **Responsive Design**: Looks great on all devices from mobile to desktop
- **Category System**: Organize posts with multiple categories
- **Parallax Hero**: Eye-catching scrolling effect on the homepage
- **Beautiful Post Cards**: Cards with background images based on post content
- **Dark Theme**: Modern dark color scheme for better readability
- **Automatic Deployment**: Set up with GitHub Actions for easy publishing
- **SEO Friendly**: Optimized for search engines
- **No Database Required**: All content is stored in Markdown files

## 📚 Blog Categories

This blog is set up with the following categories:

- **AI**: Artificial intelligence topics and applications
- **Game Development**: Creating and designing games
- **Gaming**: Video game reviews, tips, and discussions
- **Tech**: General technology topics
- **Modding**: Customizing and extending games
- **Mental Health**: Digital wellbeing and mental health in tech
- **Society**: The impact of technology on society

## 🚀 Getting Started

### For Complete Beginners

#### What You'll Need

- **A Computer**: Windows, Mac, or Linux
- **A Code Editor**: [Visual Studio Code](https://code.visualstudio.com/) is recommended (it's free!)
- **Node.js**: A JavaScript runtime ([Download here](https://nodejs.org/) - choose the LTS version)
- **Git**: Version control system ([Download here](https://git-scm.com/))

#### Step-by-Step Setup

1. **Install the prerequisites** mentioned above

2. **Open your terminal/command prompt**:
   - Windows: Search for "Command Prompt" or "PowerShell"
   - Mac: Open the Terminal app
   - Linux: Open your terminal application

3. **Clone the repository** (download the code):

   ```bash
   git clone https://github.com/yourusername/your-blog-repo.git
   cd your-blog-repo
   ```

   (Replace "yourusername/your-blog-repo" with your actual GitHub username and repository name)

4. **Install dependencies** (all the required packages):

   ```bash
   npm install
   ```

   This might take a few minutes - it's downloading all the necessary components

5. **Start the development server**:

   ```bash
   npm run dev
   ```

6. **View your blog**: Open [http://localhost:3000](http://localhost:3000) in your browser

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
