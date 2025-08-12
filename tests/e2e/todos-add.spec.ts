import { test, expect } from '@playwright/test';

test('adding a todo via form updates the list', async ({ page, request }) => {
  // Start from empty DB
  await request.post('/__test__/db/seed', { data: { todos: [] } });

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByRole('list', { name: 'todos' })).toBeVisible({ timeout: 15000 });

  // Fill and submit the form
  await page.getByPlaceholder('タスク名を入力').fill('Zeta');
  const [post] = await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/todos') && r.request().method() === 'POST' && r.status() >= 200),
    page.getByRole('button', { name: '追加' }).click(),
  ]);

  // After server processes and emits update, the list should include new item
  await expect(page.getByText('Zeta')).toBeVisible({ timeout: 15000 });
});
