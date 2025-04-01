import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Custom function to process embeds
export function processEmbeds(content) {
  let processedContent = content;
  
  // Process YouTube embeds
  processedContent = processedContent.replace(
    /!\[youtube\]\(([^)]+)\)/g,
    (match, url) => {
      // Extract video ID, title and options
      const parts = url.split(' "');
      const videoUrl = parts[0];
      const titlePart = parts.length > 1 ? parts[1].replace('"', '') : '';
      
      // Check if there are options in the title part (format: "Title|option1=value1,option2=value2")
      let title = titlePart;
      let options = {};
      
      if (titlePart.includes('|')) {
        const titleAndOptions = titlePart.split('|');
        title = titleAndOptions[0].trim();
        
        // Parse options
        if (titleAndOptions.length > 1) {
          const optionsStr = titleAndOptions[1].trim();
          optionsStr.split(',').forEach(opt => {
            if (opt.includes('=')) {
              const [key, value] = opt.split('=');
              options[key.trim()] = value.trim();
            }
          });
        }
      }
      
      // Extract video ID
      let videoId = videoUrl;
      if (videoUrl.includes('youtu.be/')) {
        videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      } else if (videoUrl.includes('v=')) {
        videoId = videoUrl.split('v=')[1].split('&')[0];
      }
      
      // Apply options
      const startTime = options.start ? `start=${options.start}` : '';
      const autoplay = options.autoplay === 'true' ? 'autoplay' : '';
      const playsInline = options.playsInline === 'true' ? 'playsinline' : '';
      
      // Use lite-youtube-embed format if available, otherwise fallback to iframe
      return `<div class="embed-container video-container">
        <lite-youtube videoid="${videoId}" playlabel="${title}" ${autoplay} ${playsInline} ${startTime ? `params="${startTime}"` : ''}></lite-youtube>
      </div>`;
    }
  );
  
  // Process Twitch embeds
  processedContent = processedContent.replace(
    /!\[twitch\]\(([^)]+)\)/g,
    (match, url) => {
      // Extract channel name
      const parts = url.split(' "');
      const channelUrl = parts[0];
      const title = parts.length > 1 ? parts[1].replace('"', '') : '';
      
      const channelName = channelUrl.includes('twitch.tv/') 
        ? channelUrl.split('twitch.tv/')[1].split('?')[0] 
        : channelUrl;
      
      const parent = process.env.NODE_ENV === 'development' ? 'localhost' : 'bikininjas.github.io';
      const titleAttr = title ? ` title="${title}"` : '';
      return `<div class="embed-container twitch-container"><iframe src="https://player.twitch.tv/?channel=${channelName}&parent=${parent}"${titleAttr} frameborder="0" allowfullscreen scrolling="no"></iframe></div>`;
    }
  );
  
  // Process Bluesky embeds
  processedContent = processedContent.replace(
    /!\[bluesky\]\(([^)]+)\)/g,
    (match, url) => {
      // Extract URL
      const parts = url.split(' "');
      const bskyUrl = parts[0];
      
      return `<div class="bluesky-embed-container"><iframe class="bluesky-embed" src="https://bsky.app/embed?url=${encodeURIComponent(bskyUrl)}" frameborder="0" allowfullscreen scrolling="no"></iframe></div>`;
    }
  );
  
  return processedContent;
}
import { slugify } from './utils';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Handle categories - support both single category and array of categories
    let categories = matterResult.data.categories || matterResult.data.category || 'Uncategorized';
    
    // Ensure categories is always an array
    if (!Array.isArray(categories)) {
      categories = [categories];
    }
    
    // Create category slugs
    const categorySlugs = categories.map(cat => slugify(cat));

    // Combine the data with the id and ensure categories exist
    return {
      id,
      ...matterResult.data,
      categories,
      categorySlugs,
      // Keep single category for backward compatibility
      category: categories[0],
      categorySlug: categorySlugs[0],
    };
  });

  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);

  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  
  // Set up the remark processor for converting Markdown to HTML
  const remarkProcessor = remark().use(html);
  
  // Then process the embeds separately
  // This is a two-step process to avoid remark sanitizing our custom HTML
  const markdownWithEmbeds = processEmbeds(matterResult.content);
  
  // Now convert the markdown parts to HTML while preserving our custom HTML
  const parts = markdownWithEmbeds.split(/(<div class="embed-container.*?<\/div>)/gs);
  let finalHtml = '';
  
  for (const part of parts) {
    if (part.startsWith('<div class="embed-container')) {
      // This is already HTML (our custom embed), keep it as is
      finalHtml += part;
    } else {
      // This is markdown, convert it to HTML
      const processed = await remarkProcessor.process(part);
      finalHtml += processed.toString();
    }
  }
  
  // For debugging
  console.log('Post ID:', id);
  console.log('Contains embeds:', markdownWithEmbeds.includes('embed-container'));
  console.log('Final HTML contains embeds:', finalHtml.includes('embed-container'));
  
  // Use the final HTML with embeds
  let contentHtml = finalHtml;

  // Handle categories - support both single category and array of categories
  let categories = matterResult.data.categories || matterResult.data.category || 'Uncategorized';
  
  // Ensure categories is always an array
  if (!Array.isArray(categories)) {
    categories = [categories];
  }

  // For backward compatibility
  const category = Array.isArray(matterResult.data.category) 
    ? matterResult.data.category[0] 
    : (matterResult.data.category || categories[0] || 'Uncategorized');
  const categorySlug = slugify(category);

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
    categories,
    category,
    categorySlug,
  };
}

// Get all categories from posts
export function getAllCategories() {
  const allPosts = getSortedPostsData();
  const categories = new Set();
  
  allPosts.forEach(post => {
    // Simplification: normaliser le traitement des catégories
    const postCategories = [];
    
    if (post.categories && Array.isArray(post.categories) && post.categories.length > 0) {
      postCategories.push(...post.categories);
    } else if (post.category) {
      postCategories.push(post.category);
    } else {
      postCategories.push('Uncategorized');
    }
    
    // Ajouter chaque catégorie à l'ensemble
    postCategories.forEach(category => categories.add(category));
  });
  
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

// Get all category slugs
export function getAllCategorySlugs() {
  // Utiliser getAllCategories pour obtenir toutes les catégories
  const allCategories = getAllCategories();
  const categorySlugMap = new Map();
  
  // Créer un slug pour chaque catégorie
  allCategories.forEach(category => {
    const slug = slugify(category);
    categorySlugMap.set(slug, category);
  });
  
  return Array.from(categorySlugMap.keys());
}

// Get category name from slug
export function getCategoryFromSlug(slug) {
  // Utiliser getAllCategories pour obtenir toutes les catégories
  const allCategories = getAllCategories();
  const categoryMap = new Map();
  
  // Créer un mapping entre slug et catégorie
  allCategories.forEach(category => {
    categoryMap.set(slugify(category), category);
  });
  
  return categoryMap.get(slug) || null;
}

// Get posts filtered by category
export function getPostsByCategory(category) {
  const allPosts = getSortedPostsData();
  
  if (category === 'all') {
    return allPosts;
  }
  
  return allPosts.filter(post => {
    // Normaliser le traitement des catégories
    const postCategories = [];
    
    if (post.categories && Array.isArray(post.categories) && post.categories.length > 0) {
      postCategories.push(...post.categories);
    } else if (post.category) {
      postCategories.push(post.category);
    } else {
      postCategories.push('Uncategorized');
    }
    
    return postCategories.includes(category);
  });
}

// Get posts filtered by category slug
export function getPostsByCategorySlug(slug) {
  const category = getCategoryFromSlug(slug);
  if (!category) {
    return [];
  }
  
  return getPostsByCategory(category);
}
