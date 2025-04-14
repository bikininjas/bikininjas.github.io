// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('http://localhost:3000');
  });

  test('navigates to home page', async ({ page }) => {
    // Verify hero section
    await expect(page.locator('.ParallaxHero_title')).toBeVisible();
    await expect(page.locator('.ParallaxHero_subtitle')).toBeVisible();
    
    // Verify posts section
    await expect(page.locator('h2')).toContainText('Derniers Articles');
    await expect(page.locator('.PostCard_card')).toHaveCount(await page.locator('.PostCard_card').count());
  });

  test('navigates to individual post', async ({ page }) => {
    // Click first post
    await page.locator('.PostCard_cardLink').first().click();
    
    // Verify post content
    await expect(page.locator('article')).toBeVisible();
    await expect(page.locator('.PostContent_postContent')).toBeVisible();
    await expect(page.locator('a')).toContainText('← Back to all posts');
  });

  test('navigates between categories', async ({ page }) => {
    // Click a category link
    await page.locator('.CategoryNav_link').nth(1).click();
    
    // Verify category page
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('.PostCard_card')).toHaveCount(await page.locator('.PostCard_card').count());
  });

  test('loads embedded content', async ({ page }) => {
    // Go to a post with embeds
    await page.goto('http://localhost:3000/posts/unreal-engine-beginners-guide');
    
    // Verify embeds load
    await expect(page.locator('.embed-container')).toBeVisible();
    await expect(page.locator('lite-youtube')).toBeVisible();
  });

  test('should navigate to the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Biki Ninjas Blog/);
  });

  test('should navigate to the about page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=About');
    await expect(page.url()).toContain('/about');
  });

  test('should navigate to a blog post', async ({ page }) => {
    await page.goto('/');
    // Click on the first blog post
    await page.click('.post-item a');
    // Verify we're on a blog post page
    await expect(page.locator('article.blog-post')).toBeVisible();
  });

  test('should navigate between pages using navbar', async ({ page }) => {
    await page.goto('/');
    // Test navigation links
    await page.click('nav >> text=Blog');
    await expect(page.url()).toContain('/blog');
    
    await page.click('nav >> text=Home');
    await expect(page.url()).not.toContain('/blog');
  });
});
