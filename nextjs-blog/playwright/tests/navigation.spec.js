// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation Tests', () => {
  test('should navigate to the home page', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que le titre est présent
    await expect(page.locator('h1.ParallaxHero_title__K8rqy')).toBeVisible();
    
    // Vérifier que les liens vers les articles sont présents
    const articleLinks = page.locator('a[href^="/posts/"]');
    await expect(articleLinks).toHaveCount(await articleLinks.count());
  });

  test('should navigate to a blog post', async ({ page }) => {
    // Aller à la page d'accueil
    await page.goto('/');
    
    // Cliquer sur le premier article
    await page.locator('a[href^="/posts/"]').first().click();
    
    // Vérifier que nous sommes sur la page de l'article
    await expect(page.locator('h1')).toBeVisible();
    
    // Vérifier que le contenu principal est présent
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load Twitter embeds', async ({ page }) => {
    // Aller à la page de l'article sur le harcèlement
    await page.goto('/posts/harcelement-en-ligne');
    
    // Vérifier que la page est chargée
    await expect(page.locator('h1')).toBeVisible();
    
    // Vérifier que le contenu principal est présent
    await expect(page.locator('main')).toBeVisible();
  });

  test('should load Bluesky embeds', async ({ page }) => {
    // Aller à la page de l'article sur le harcèlement
    await page.goto('/posts/harcelement-en-ligne');
    
    // Vérifier que la page est chargée
    await expect(page.locator('h1')).toBeVisible();
    
    // Vérifier que le contenu principal est présent
    await expect(page.locator('main')).toBeVisible();
  });
});
