import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
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

  // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // Ensure category exists, default to 'Uncategorized' if not specified
  const category = matterResult.data.category || 'Uncategorized';
  const categorySlug = slugify(category);

  // Combine the data with the id and contentHtml
  return {
    id,
    contentHtml,
    ...matterResult.data,
    category,
    categorySlug,
  };
}

// Get all categories from posts
export function getAllCategories() {
  const allPosts = getSortedPostsData();
  const categories = new Set();
  
  allPosts.forEach(post => {
    if (post.categories && Array.isArray(post.categories)) {
      post.categories.forEach(category => {
        categories.add(category);
      });
    } else if (post.category) {
      categories.add(post.category);
    } else {
      categories.add('Uncategorized');
    }
  });
  
  return Array.from(categories).sort((a, b) => a.localeCompare(b));
}

// Get all category slugs
export function getAllCategorySlugs() {
  const allPosts = getSortedPostsData();
  const categorySlugMap = new Map();
  
  allPosts.forEach(post => {
    if (post.categories && Array.isArray(post.categories)) {
      post.categories.forEach(category => {
        const slug = slugify(category);
        categorySlugMap.set(slug, category);
      });
    } else {
      const category = post.category || 'Uncategorized';
      const slug = slugify(category);
      categorySlugMap.set(slug, category);
    }
  });
  
  return Array.from(categorySlugMap.keys());
}

// Get category name from slug
export function getCategoryFromSlug(slug) {
  const allPosts = getSortedPostsData();
  const categoryMap = new Map();
  
  allPosts.forEach(post => {
    if (post.categories && Array.isArray(post.categories)) {
      post.categories.forEach(category => {
        categoryMap.set(slugify(category), category);
      });
    } else {
      const category = post.category || 'Uncategorized';
      categoryMap.set(slugify(category), category);
    }
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
    if (post.categories && Array.isArray(post.categories)) {
      return post.categories.includes(category);
    } else {
      const postCategory = post.category || 'Uncategorized';
      return postCategory === category;
    }
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
