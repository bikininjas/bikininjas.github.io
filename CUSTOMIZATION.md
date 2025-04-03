# Customization Guide for Your Next.js Blog

This guide will help you customize your Next.js Markdown blog, even if you're a complete beginner. Follow these step-by-step instructions to make the blog your own.

## Table of Contents

- [Adding Blog Posts](#adding-blog-posts)
- [Working with Images](#working-with-images)
- [Customizing Fonts](#customizing-fonts)
- [Changing the Layout](#changing-the-layout)
- [Modifying Colors](#modifying-colors)
- [Customizing the Parallax Effect](#customizing-the-parallax-effect)
- [Adding Author Information](#adding-author-information)
- [Adding New Categories](#adding-new-categories)
- [Customizing Post Cards](#customizing-post-cards)
- [Deployment](#deployment)

## Customizing Fonts

### Using Google Fonts

1. **Add a New Font**:
   - Open [/styles/globals.css](cci:7://file:///home/seb/GITRepos/bikininjas.github.io-1/nextjs-blog/styles/globals.css:0:0-0:0)
   - Replace the Google Fonts import with your desired font
   - Update the `--font-family` CSS variable

2. **Current Font Settings**:

   
   ```css
   /* Import Google Fonts */
   @import url('https://fonts.googleapis.com/css2?family=Turret+Road:wght@400;500;600;700&display=swap');

   /* Font variable */
   --font-family: 'Turret Road', sans-serif;
   ```

   
3. **Typography Hierarchy**:
   - Headings (h1-h6): 600 weight
   - Paragraphs: 400 weight
   - Buttons and Links: 500 weight

## Modifying Colors

### Color Variables

All colors are defined as CSS variables in [/styles/globals.css](cci:7://file:///home/seb/GITRepos/bikininjas.github.io-1/nextjs-blog/styles/globals.css:0:0-0:0). Modify these to change the entire theme:

   
   ```css
   :root {
     --background-color: #2a2a2a;    /* Dark grey background */
     --card-bg: #333333;             /* Card background */
     --header-bg: #222222;           /* Header and footer background */
     --text-color: #cac2c2;          /* Main text color */
     --text-muted: #c0c0c0;          /* Muted text color */
     --accent-color: #f30000;        /* Accent color (red) */
     --accent-hover: #0060df;        /* Hover state for accent */
     --border-color: #444444;        /* Border color */
   }
   ```

   
### Applying Colors

Colors are automatically applied throughout the site using these variables. To change a specific element's color, use the appropriate CSS variable.

## Customizing the Logo

### Logo Sizing

1. **Hero Section Logo** (ParallaxHero):
   - Uses viewport-based sizing with `clamp()`
   - Current settings: `clamp(150px, 40vw, 350px)`
   - Adjusts based on screen size while maintaining minimum and maximum sizes

2. **Navigation Logo**:
   - Fixed size of 100px
   - Responsive hover effect

### Logo Positioning

The logo is centered in both the navigation bar and hero section. To adjust positioning:

1. **Navigation Logo**:

   
   ```css
   .logoContainer {
     display: flex;
     align-items: center;
     gap: 10px;
   }
   ```

   
2. **Hero Section Logo**:

   
   ```css
   .parallaxContent {
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
   }
   ```

   
### Logo Hover Effects

1. **Scale Effect**: Increase size on hover
2. **Rotation Effect**: Rotate 360 degrees on hover

To modify these effects, edit the transform properties in the respective CSS modules.

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
- **author**: (Optional) The name of the post author
- **authorHtml**: (Optional) Markdown or HTML content for the author footer section

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


## Adding Author Information

### Author Footer

You can add author information to your blog posts that will appear as a footer at the end of each post:

1. In your post's front matter, add the `author` and optionally the `authorHtml` properties:

   
   ```markdown
   ---
   title: 'Your Post Title'
   date: '2025-04-01'
   excerpt: 'A brief description'
   categories: ['Category1']
   author: 'Your Name'
   authorHtml: "<p><strong>Written by:</strong> Your Name</p><p><em>Your bio or credentials here.</em></p>"
   ---
   ```

   
1. The `author` property is used for the author's name.
2. The `authorHtml` property allows you to add formatted HTML content to the author footer, such as credentials, social media links, or a short bio.
3. If you only specify `author` without `authorHtml`, a simple "Written by: [Author Name]" will be displayed.

### Customizing Author Footer Style

To customize the appearance of the author footer:

1. Open `styles/globals.css`
2. Find the `.author-footer` class
3. Modify the styling as needed:

   
   ```css
   .author-footer {
     margin-top: 3rem;
     padding-top: 1rem;
     color: var(--text-muted);
   }

   .author-footer hr {
     border: 0;
     height: 1px;
     background-color: var(--border-color);
     margin-bottom: 1.5rem;
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
