# Customization Guide for Your Next.js Blog

This guide will help you customize your Next.js Markdown blog, even if you're a complete beginner. Follow these step-by-step instructions to make the blog your own.

## Table of Contents

- [Adding Blog Posts](#adding-blog-posts)
- [Working with Images](#working-with-images)
- [Customizing Fonts](#customizing-fonts)
- [Changing the Layout](#changing-the-layout)
- [Modifying Colors](#modifying-colors)
- [Customizing the Parallax Effect](#customizing-the-parallax-effect)
- [Adding New Categories](#adding-new-categories)
- [Customizing Post Cards](#customizing-post-cards)
- [Deployment](#deployment)

## Adding Blog Posts

### Creating a New Post

1. Navigate to the `posts` folder in your project
2. Create a new Markdown file (`.md`) with a descriptive name (e.g., `my-first-post.md`)
3. Add the following "front matter" at the top of your file:

```markdown
---
title: 'Your Post Title Here'
date: '2025-04-01'
excerpt: 'A brief description of your post that will appear on the homepage'
categories: ['Category1', 'Category2']
coverImage: 'https://example.com/your-image.jpg'
---

Your post content goes here...
```


### Front Matter Explained

- **title**: The title of your blog post
- **date**: Publication date in 'YYYY-MM-DD' format
- **excerpt**: A short summary that appears on the homepage
- **categories**: An array of categories your post belongs to (must be in square brackets)
- **coverImage**: (Optional) A URL to an image that will be used as the card background

### Writing Content

After the front matter, write your post content using Markdown:

```markdown
## My First Heading

This is a paragraph with **bold text** and *italic text*.

### A Subheading

- This is a bullet point
- Another bullet point

1. This is a numbered list
2. Second item in the list

[This is a link](https://example.com)
```


## Working with Images

### Adding Images to Posts

You can include images in your posts in two ways:

1. **External Images**: Link to images hosted elsewhere

   ```markdown
   ![Alt text](https://example.com/image.jpg)
   ```


2. **Local Images**: Store images in the `public/images` folder

   ```markdown
   ![Alt text](/images/my-image.jpg)
   ```


### Post Card Background Images

Each post card can have a background image:

1. **Specific Image**: Add a `coverImage` field to your post's front matter

   ```markdown
   coverImage: 'https://example.com/your-image.jpg'
   ```


2. **Category-Based Images**: If no coverImage is specified, the system will use a default image based on the post's first category

3. **Default Image**: If no category image is available, a generic tech image will be used

## Customizing Fonts

To change the fonts used in your blog:

1. Open `/styles/globals.css`
2. Find the `:root` section with CSS variables
3. Update the font-family variables:

   ```css
   :root {
     --font-main: 'Your Main Font', sans-serif;
     --font-headings: 'Your Heading Font', serif;
   }
   ```

4. To use Google Fonts, add the font import at the top of the file:

   ```css
   @import url('https://fonts.googleapis.com/css2?family=Your+Font+Name:wght@400;700&display=swap');
   ```


## Changing the Layout

### Adjusting Card Sizes

1. Open `/styles/Card.module.css`
2. Modify the `.card` class to change the size and appearance of post cards

### Modifying the Grid Layout

1. Open `/styles/globals.css`
2. Find the `.grid` class
3. Adjust the grid properties:

   ```css
   .grid {
     display: grid;
     grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
     gap: 2rem;
   }
   ```


### Changing Overall Layout Width

1. Open `/styles/globals.css`
2. Find the `.container` class
3. Adjust the max-width and width properties:

   ```css
   .container {
     width: 90%;
     max-width: 1200px;
     margin: 0 auto;
   }
   ```


## Modifying Colors

To change the color theme of your blog:

1. Open `/styles/globals.css`
2. Find the `:root` section with CSS variables
3. Update the color variables:

   ```css
   :root {
     --background-color: #2a2a2a;
     --card-bg: #333333;
     --header-bg: #222222;
     --text-color: #f5f5f5;
     --text-muted: #c0c0c0;
     --accent-color: #61dafb;
     --link-color: #61dafb;
   }
   ```


## Customizing the Parallax Effect

### Changing the Background Image

1. Open `/components/ParallaxHero.js`
2. Find the line with the background image URL
3. Replace it with your own image URL:

   ```javascript
   const backgroundImage = 'https://example.com/your-image.jpg';
   ```


### Adjusting Parallax Speed

1. In the same file, find the `handleScroll` function
2. Modify the speed factor (higher values = slower movement):

   ```javascript
   const offset = window.scrollY;
   const parallaxOffset = offset * 0.5; // Change 0.5 to adjust speed
   ```


### Changing Parallax Height

1. Open `/styles/ParallaxHero.module.css`
2. Find the `.parallaxContainer` class
3. Adjust the height property:

   ```css
   .parallaxContainer {
     height: 60vh; /* Change to your preferred height */
   }
   ```


## Adding New Categories

Categories are automatically generated from your blog posts. To add a new category:

1. Simply use a new category name in the `categories` field of your post's front matter
2. The system will automatically add it to the category navigation

To customize category-specific images:

1. Open `/components/PostCard.js`
2. Find the `categoryImages` object
3. Add or update entries for your categories:

   ```javascript
   const categoryImages = {
     'Your Category': 'https://example.com/category-image.jpg',
     // other categories...
   };
   ```


## Customizing Post Cards

### Changing Card Appearance

1. Open `/styles/Card.module.css`
2. Modify the various card-related classes to change:
   - Border radius (`.card` class)
   - Shadow effects (`.card` and `.card:hover` classes)
   - Text colors and sizes (`.cardTitle`, `.cardExcerpt`, etc.)
   - Background overlay opacity (`.cardWithBg::before` class)

### Modifying Card Layout

1. In the same file, adjust the padding, margins, and flex properties to change how content is arranged within cards

## Deployment

This blog is set up to deploy automatically to GitHub Pages:

1. Push your changes to the main branch
2. The GitHub Actions workflow will build and deploy your site
3. Your site will be available at `https://yourusername.github.io`

To customize the deployment process:

1. Open `/.github/workflows/deploy-blog.yml`
2. Modify the workflow as needed

### Manual Deployment

If you prefer to deploy manually:

1. Build the site:

   ```bash
   npm run build && npm run export
   ```

2. The static site will be generated in the `out` folder
3. Upload these files to any static hosting service

---

Need more help? Check the [Next.js documentation](https://nextjs.org/docs) or [open an issue](https://github.com/yourusername/your-repo/issues) on GitHub.
