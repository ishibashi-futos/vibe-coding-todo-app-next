import { test, expect } from '@playwright/test';

test('homepage renders and shows docs link', async ({ page }) => {
  await page.goto('/');

  // Check for a couple of stable texts on the starter page
  await expect(page.getByRole('link', { name: 'Read our docs' })).toBeVisible();
  await expect(page.getByText('Learn')).toBeVisible();
});
