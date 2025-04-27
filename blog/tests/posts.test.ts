import { describe, it, expect } from 'vitest';
import { getAllPosts, getPostBySlug, getPostsByCategory, getPostSlugs } from '../src/app/posts';

// These are integration tests for the Markdown blog post system.
describe('Blog posts system', () => {
  it('should list all post slugs', () => {
    const slugs = getPostSlugs();
    expect(slugs).toContain('hello-world.md');
    expect(slugs).toContain('tech-ai.md');
  });

  it('should get post by slug', () => {
    const post = getPostBySlug('hello-world');
    expect(post.title).toBe('Hello World');
    expect(post.categories).toContain('general');
    expect(post.categories).toContain('intro');
    expect(post.content).toMatch(/This is your first markdown blog post/);
  });

  it('should get all posts sorted by date desc', () => {
    const posts = getAllPosts();
    expect(posts[0].slug).toBe('hello-world');
    expect(posts[1].slug).toBe('tech-ai');
  });

  it('should filter posts by category', () => {
    const techPosts = getPostsByCategory('technology');
    expect(techPosts.length).toBe(1);
    expect(techPosts[0].slug).toBe('tech-ai');

    const generalPosts = getPostsByCategory('general');
    expect(generalPosts.length).toBe(1);
    expect(generalPosts[0].slug).toBe('hello-world');
  });
});
