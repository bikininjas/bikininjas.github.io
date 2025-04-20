import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getPostSlugs() {
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return { slug: realSlug, meta: data, content };
}

export async function getPostHtml(slug: string) {
  const { content, ...rest } = getPostBySlug(slug);
  const processedContent = await remark().use(html).process(content);
  return { ...rest, contentHtml: processedContent.toString() };
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  const posts = slugs.map(slug => getPostBySlug(slug));
  // Sort posts by date desc
  return posts.sort((a, b) => (a.meta.date < b.meta.date ? 1 : -1));
}

export function getAllCategories() {
  const posts = getAllPosts();
  const categories = new Set(posts.map(post => post.meta.category));
  return Array.from(categories);
}

export function getPostsByCategory(category: string) {
  return getAllPosts().filter(post => post.meta.category === category);
}
