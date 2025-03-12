import fs from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

const postsDirectory = join(process.cwd(), '_posts');

export function getPostSlugs() {
  try {
    return fs.readdirSync(postsDirectory);
  } catch {
    // If the directory doesn't exist yet, return an empty array
    return [];
  }
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);

  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    type Items = {
      [key: string]: string | object;
    };

    const items: Items = {};

    // Ensure only the minimal needed data is exposed
    fields.forEach((field) => {
      if (field === 'slug') {
        items[field] = realSlug;
      }
      if (field === 'content') {
        items[field] = content;
      }

      if (typeof data[field] !== 'undefined') {
        items[field] = data[field];
      }
    });

    return items;
  } catch {
    return {};
  }
}

export function getAllPosts(fields: string[] = []) {
  try {
    const slugs = getPostSlugs();
    const posts = slugs
      .map((slug) => getPostBySlug(slug, fields))
      // Sort posts by date in descending order
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return posts;
  } catch {
    return [];
  }
}

export function getPostsByCategory(category: string, fields: string[] = []) {
  const allPosts = getAllPosts(fields);
  return allPosts.filter((post) => {
    const postCategory = post.category as string;
    return (
      postCategory && postCategory.toLowerCase() === category.toLowerCase()
    );
  });
}

export function getAllCategories() {
  const posts = getAllPosts(['category']);
  const categories = posts
    .map((post) => post.category as string)
    .filter((category): category is string => !!category); // Filter out null or undefined categories
  return Array.from(new Set(categories));
}
