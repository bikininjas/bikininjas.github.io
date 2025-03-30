# BikiNinjas Blog Customization Guide

This document provides detailed instructions on how to customize various aspects of your BikiNinjas blog, including adding new content, changing the appearance, and modifying the layout.

## Table of Contents

1. [Adding New Blog Posts](#adding-new-blog-posts)
2. [Including Images in Posts](#including-images-in-posts)
3. [Customizing Fonts](#customizing-fonts)
4. [Modifying Card Sizes and Appearance](#modifying-card-sizes-and-appearance)
5. [Changing Colors and Theme](#changing-colors-and-theme)
6. [Adjusting the Parallax Effect](#adjusting-the-parallax-effect)
7. [Customizing the Layout](#customizing-the-layout)
8. [Adding New Categories](#adding-new-categories)
9. [Deployment](#deployment)

## Adding New Blog Posts

Blog posts are written in Markdown format and stored in the `nextjs-blog/posts` directory.

### Step-by-Step Guide:

1. Create a new Markdown file in the `nextjs-blog/posts` directory with a unique name (e.g., `my-new-post.md`).
2. Add the required front matter at the top of the file:

```markdown
---
title: 'Your Post Title'
date: '2025-03-29'
excerpt: 'A brief summary of your post that will appear on the home page'
categories: ['category1', 'category2']
---

Your post content goes here...
```

3. Write your post content in Markdown format below the front matter.
4. Save the file. The post will automatically appear on the home page and in the appropriate category pages.

### Front Matter Fields:

- **title**: The title of your blog post
- **date**: The publication date in 'YYYY-MM-DD' format
- **excerpt**: A short summary that appears on the home page
- **categories**: An array of categories the post belongs to (must match existing categories)

## Including Images in Posts

You can include images in your blog posts by placing them in the `nextjs-blog/public/images` directory.

### Step-by-Step Guide:

1. Add your image to the `nextjs-blog/public/images` directory.
2. Reference the image in your Markdown file using the following syntax:

```markdown
![Alt text for the image](/images/your-image-filename.jpg)
```

3. For more control over the image display, you can use HTML directly in your Markdown:

```markdown
<div style="text-align: center; margin: 2rem 0;">
  <img src="/images/your-image-filename.jpg" alt="Description" style="max-width: 100%; height: auto; border-radius: 8px;" />
  <p style="font-style: italic; margin-top: 0.5rem;">Image caption</p>
</div>
```

### Image Optimization:

- Keep image files under 500KB when possible for better performance
- Use JPG for photographs and PNG for graphics with transparency
- Consider using WebP format for better compression and quality

## Customizing Fonts

The blog uses system fonts by default, but you can easily change them by modifying the CSS variables in the `nextjs-blog/styles/globals.css` file.

### Changing Font Family:

1. Open `nextjs-blog/styles/globals.css`
2. Locate the `:root` section at the top of the file
3. Add or modify the font-family variables:

```css
:root {
  --font-family-heading: 'Your Heading Font', sans-serif;
  --font-family-body: 'Your Body Font', serif;
}
```

4. Apply these variables to the appropriate elements:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
}

body, p, div, span {
  font-family: var(--font-family-body);
}
```

### Using Google Fonts:

1. Add the Google Fonts link to the `<Head>` section in `nextjs-blog/components/layout.js`:

```jsx
<Head>
  <title>{title}</title>
  <meta name="description" content="A Next.js Markdown blog" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
</Head>
```

2. Update your CSS variables to use these fonts:

```css
:root {
  --font-family-heading: 'Montserrat', sans-serif;
  --font-family-body: 'Merriweather', serif;
}
```

## Modifying Card Sizes and Appearance

Blog post cards can be customized by modifying the CSS in `nextjs-blog/styles/globals.css`.

### Changing Card Size:

1. Locate the `.card` class in `globals.css`:

```css
.card {
  margin: 1rem 0;
  padding: 1.5rem;
  text-align: left;
  color: inherit;
  text-decoration: none;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  transition: all 0.3s ease;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  background-color: var(--card-bg);
}
```

2. Adjust the following properties to change the card size:
   - `width`: Controls the width of the card
   - `padding`: Controls the internal spacing
   - `margin`: Controls the external spacing

### Modifying Card Grid Layout:

To change how many cards appear per row:

1. Find the grid layout for cards:

```css
.blog-section .grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
  margin-top: 1.5rem;
}
```

2. Modify the `minmax(300px, 1fr)` value:
   - Increase the first value (300px) to make cards wider and show fewer per row
   - Decrease it to make cards narrower and show more per row

### Styling Card Elements:

You can customize individual elements within cards:

```css
.card-title {
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
}

.card-date {
  display: block;
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
}

.card-excerpt {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}
```

## Changing Colors and Theme

The blog uses CSS variables for consistent theming. You can modify these variables in the `nextjs-blog/styles/globals.css` file.

### Main Theme Colors:

```css
:root {
  --background-color: #2a2a2a;
  --card-bg: #333333;
  --header-bg: #222222;
  --text-color: #f5f5f5;
  --text-muted: #c0c0c0;
  --accent-color: #0070f3;
  --border-color: #444444;
}
```

- `--background-color`: Main background color of the site
- `--card-bg`: Background color for cards and content blocks
- `--header-bg`: Background color for the header/navbar
- `--text-color`: Primary text color
- `--text-muted`: Secondary text color for dates, captions, etc.
- `--accent-color`: Color for links, buttons, and highlights
- `--border-color`: Color for borders and dividers

### Creating a Light Theme:

To switch to a light theme, replace the color values:

```css
:root {
  --background-color: #f9f9f9;
  --card-bg: #ffffff;
  --header-bg: #f0f0f0;
  --text-color: #333333;
  --text-muted: #666666;
  --accent-color: #0070f3;
  --border-color: #e0e0e0;
}
```

## Adjusting the Parallax Effect

The parallax hero section can be customized by modifying the `ParallaxHero.js` component and its CSS module.

### Changing the Background Image:

1. Add your new image to `nextjs-blog/public/images/`
2. Open `nextjs-blog/components/ParallaxHero.js`
3. Update the backgroundImage prop or the default value:

```jsx
<div 
  className={styles.parallaxBackground}
  style={{ 
    backgroundImage: `url(${backgroundImage || '/images/your-new-image.jpg'})`,
    transform: `translateY(${offset * 0.3}px)`,
    backgroundPosition: '50% 50%'
  }}
/>
```

### Adjusting Parallax Speed:

The parallax effect speed is controlled by the multiplier applied to the scroll offset:

```jsx
transform: `translateY(${offset * 0.3}px)`
```

- Increase the value (e.g., 0.5) for a more pronounced effect
- Decrease the value (e.g., 0.1) for a more subtle effect

### Modifying Hero Height:

To change the height of the parallax hero section, edit `nextjs-blog/components/ParallaxHero.module.css`:

```css
.parallaxContainer {
  position: relative;
  height: 60vh; /* Change this value */
  min-height: 400px; /* Change this value */
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  border-radius: 8px;
}
```

## Customizing the Layout

The overall layout can be modified by editing the `nextjs-blog/components/layout.js` file and its associated CSS.

### Changing the Container Width:

To adjust the width of the main content area:

```css
.container {
  min-height: 100vh;
  width: 90%; /* Change this percentage */
  padding: 0;
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  margin: 0 auto;
}
```

### Adjusting Spacing:

To modify the spacing between elements:

```css
.main {
  padding: 5rem 0; /* Change top/bottom padding */
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  background-color: var(--background-color);
}
```

## Adding New Categories

Categories are automatically generated from the front matter of your blog posts.

### Creating a New Category:

1. Simply add a new category name to the `categories` array in the front matter of a blog post:

```markdown
---
title: 'Your Post Title'
date: '2025-03-29'
excerpt: 'A brief summary of your post'
categories: ['existing-category', 'new-category']
---
```

2. The new category will automatically appear in the category navigation.

### Customizing Category Display:

To modify how categories appear, edit the `nextjs-blog/components/CategoryNav.js` component and its associated CSS.

## Deployment

The blog is configured to deploy automatically to GitHub Pages using GitHub Actions.

### Deployment Process:

1. Push your changes to the main branch of your GitHub repository
2. The GitHub Actions workflow will automatically build and deploy your blog
3. Your changes will be live on GitHub Pages within a few minutes

### Manual Deployment:

If you need to deploy manually:

1. Run the build and export commands:

```bash
cd nextjs-blog
npm run build
npm run export
```

2. The static site will be generated in the `nextjs-blog/out` directory
3. You can deploy this directory to any static hosting service

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Markdown Guide](https://www.markdownguide.org/)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

---

If you have any questions or need further assistance with customizing your blog, please open an issue on the GitHub repository.
