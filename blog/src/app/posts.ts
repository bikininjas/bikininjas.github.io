import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import rehypeHighlight from 'rehype-highlight';

export type Post = {
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  categories: string[];
  content: string;
  image?: string;
};

const postsDirectory = path.join(process.cwd(), 'posts');

export function getPostSlugs(): string[] {
  console.log('[Markdown Blog] Looking for posts in:', postsDirectory);
  const files = fs.readdirSync(postsDirectory);
  console.log('[Markdown Blog] Files found in postsDirectory:', files);
  if (!fs.existsSync(postsDirectory)) {
    console.error('[Markdown Blog] Posts directory not found:', postsDirectory);
    return [];
  }
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith('.md'));
}

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  let fileContents: string;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
    console.error(`[Markdown Blog] Failed to read file: ${fullPath}`, err);
    throw err;
  }
  let data, content;
  try {
    ({ data, content } = matter(fileContents));
  } catch (err) {
    console.error(`[Markdown Blog] Failed to parse frontmatter for: ${fullPath}`, err);
    throw err;
  }
  let processedContent: string;
  try {
    processedContent = remark()
      .use(html)
      .use(rehypeHighlight)
      .processSync(content)
      .toString();
  } catch (err) {
    console.error(`[Markdown Blog] Failed to render markdown for: ${fullPath}`, err);
    processedContent = content;
  }
  return {
    title: data.title ?? '',
    slug: typeof data.slug === 'string' && data.slug.trim() !== '' ? data.slug : realSlug,
    date: typeof data.date === 'string'
      ? data.date
      : (data.date instanceof Date && !isNaN(data.date.getTime()))
        ? data.date.toISOString().slice(0, 10)
        : '',
    excerpt: data.excerpt ?? '',
    categories: Array.isArray(data.categories) ? data.categories : [],
    content: processedContent,
    image: data.image ?? undefined,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts: Post[] = [];
  for (const slug of slugs) {
    try {
      const post = getPostBySlug(slug);
      if (
        typeof post.slug === 'string' && post.slug.trim() !== '' &&
        typeof post.title === 'string' && post.title.trim() !== '' &&
        typeof post.date === 'string' && post.date.trim() !== ''
      ) {
        posts.push(post);
      } else {
        console.warn('[Markdown Blog] Invalid post fields:', slug, post);
      }
    } catch (err) {
      console.error('[Markdown Blog] Error loading post:', slug, err);
    }
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((post) => post.categories.includes(category));
}
