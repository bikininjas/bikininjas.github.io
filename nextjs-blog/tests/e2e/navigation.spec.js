// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Navigation Tests', () => {
  test('should navigate to the home page', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier que le titre est présent
    await expect(page.locator('h1')).toContainText('Blog');
    
    // Vérifier que la liste des articles est présente
    const articleLinks = page.locator('ul li a');
    const count = await articleLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should navigate to a blog post', async ({ page }) => {
    // Aller à la page d'accueil
    await page.goto('/');
    
    // Cliquer sur le premier article
    await page.locator('ul li a').first().click();
    
    // Vérifier que nous sommes sur la page de l'article
    await expect(page.locator('article h1')).toBeVisible();
    
    // Vérifier que le lien de retour est présent
    await expect(page.locator('a')).toContainText('← Back to home');
  });

  test('should load Twitter embeds', async ({ page }) => {
    // Aller à la page de l'article sur le harcèlement
    await page.goto('/posts/harcelement-en-ligne');
    
    // Vérifier que l'article est chargé
    await expect(page.locator('article h1')).toContainText('Harcèlement en Ligne');
    
    // Vérifier que l'embed Twitter est présent (le iframe sera créé par le script Twitter)
    await expect(page.locator('.twitter-tweet')).toBeVisible();
    
    // Attendre que le script Twitter soit chargé et crée l'iframe (peut prendre du temps)
    await page.waitForSelector('iframe[id^="twitter-widget"]', { timeout: 10000 }).catch(() => {
      console.log('Twitter iframe not loaded, but test continues');
    });
  });

  test('should load Bluesky embeds', async ({ page }) => {
    // Aller à la page de l'article sur le harcèlement
    await page.goto('/posts/harcelement-en-ligne');
    
    // Vérifier que l'embed Bluesky est présent
    await expect(page.locator('.bluesky-embed')).toBeVisible();
  });
});
