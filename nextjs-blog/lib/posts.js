import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Custom function to process embeds
export function processEmbeds(content) {
  const youtubeRegex = /!\[youtube\]\((https:\/\/(?:youtu\.be\/|youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+))(?:\s+"([^"]*)")?\)/g;
  const twitchRegex = /!\[twitch\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;
  const blueskyRegex = /!\[bluesky\]\((https:\/\/bsky\.app\/profile\/[^/]+\/post\/[^)\s]+)\)/g;

  let processedContent = content;

  // Process YouTube embeds
  processedContent = processedContent.replace(youtubeRegex, (match, url, videoId, title = "") => {
    if (!videoId || videoId.length < 4) return match;
    
    // Parse options from title if present (format: "Title|option1=value1,option2=value2")
    let options = {};
    let displayTitle = title;
    
    if (title.includes('|')) {
      const [titlePart, optionsPart] = title.split('|');
      displayTitle = titlePart;
      optionsPart.split(',').forEach(option => {
        const [key, value] = option.split('=');
        if (key && value) {
          options[key.trim()] = value.trim();
        }
      });
    }

    // Escape special characters in title
    const escapedTitle = displayTitle.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));

    // Build options string
    const optionsString = Object.entries(options)
      .map(([key, value]) => `${key}="${value}"`)
      .join(' ');

    return `<div class="embed-container video-container">
        <lite-youtube videoid="${videoId}" playlabel="${escapedTitle}" ${optionsString}></lite-youtube>
      </div>`;
  });

  // Process Twitch embeds
  processedContent = processedContent.replace(twitchRegex, (match, channel, title = "") => {
    if (!channel || channel === 'invalid-url') return match;
    const channelName = channel.split('/').pop();
    if (!channelName || channelName === '') return match;
    return `<div class="embed-container twitch-container"><iframe src="https://player.twitch.tv/?channel=${channelName}&parent=${process.env.NODE_ENV === 'development' ? 'localhost' : 'bikininjas.github.io'}" frameborder="0" allowfullscreen scrolling="no"></iframe></div>`;
  });

  // Process Bluesky embeds
  processedContent = processedContent.replace(blueskyRegex, (match, url) => {
    if (!url || !url.includes('/post/')) return match;
    return `<div class="bluesky-embed-container"><iframe class="bluesky-embed" src="https://bsky.app/embed?url=${encodeURIComponent(url)}" frameborder="0" allowfullscreen scrolling="no"></iframe></div>`;
  });

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
