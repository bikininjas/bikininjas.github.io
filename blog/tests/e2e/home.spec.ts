import { test, expect } from '@playwright/test';

test('homepage loads and displays main content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
});
