import { test, expect } from '@playwright/test';

test('toggling a todo updates completed state via PATCH and realtime refresh', async ({ page, request }) => {
  // Seed initial data
  await request.post('/__test__/db/seed', {
    data: {
      todos: [
        { id: 't1', title: 'ToggleMe', description: '', dueDate: '', completed: false },
      ],
    },
  });

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const row = page.getByRole('list', { name: 'todos' }).locator('li').filter({ hasText: 'ToggleMe' });
  await expect(row).toBeVisible({ timeout: 15000 });

  // Click the checkbox
  await row.getByRole('checkbox').click();

  // After server toggles and emits, client refetches
  // We assert by waiting until the checkbox becomes checked
  await expect(row.getByRole('checkbox')).toBeChecked({ timeout: 15000 });
});

