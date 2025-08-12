import { test, expect } from '@playwright/test';

test('adding clears the input field', async ({ page }) => {
  await page.route('**/api/todos', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'e1', title: 'Gamma', description: '', dueDate: '', completed: false }),
    });
  });

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');

  const input = page.getByPlaceholder('タスク名を入力');
  await input.fill('Gamma');
  await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/todos') && r.request().method() === 'POST' && r.status() >= 200),
    page.getByRole('button', { name: '追加' }).click(),
  ]);

  await expect(input).toHaveValue('', { timeout: 15000 });
});
