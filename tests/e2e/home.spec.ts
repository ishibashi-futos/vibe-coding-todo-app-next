import { test, expect } from '@playwright/test';

test('homepage shows refreshed UI without Next template items', async ({ page }) => {
  await page.goto('/');

  // Default Next template texts should be gone
  await expect(page.getByText('Get started by editing').first()).toHaveCount(0);
  await expect(page.getByText('Learn')).toHaveCount(0);
  await expect(page.getByText('Examples')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'Read our docs' })).toHaveCount(0);

  // New heading with a fresh Tailwind style should be visible
  const heading = page.getByRole('heading', { name: /todo app/i });
  await expect(heading).toBeVisible();
  // Has a tailwind color class applied
  await expect(heading).toHaveAttribute('class', /text-sky-600|text-blue-600/);
});
