import matter from 'gray-matter';

describe('Markdown front matter', () => {
  it('parses front matter correctly', () => {
    const md = `---\ntitle: Test Post\ndate: 2024-04-20\nexcerpt: Hello\ncategories: [test]\n---\n\n# Hello World`;
    const { data, content } = matter(md);
    expect(data.title).toBe('Test Post');
    expect(data.categories).toContain('test');
    expect(content.trim()).toBe('# Hello World');
  });
});
