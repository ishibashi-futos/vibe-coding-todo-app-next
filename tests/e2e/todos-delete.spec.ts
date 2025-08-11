import { test, expect } from '@playwright/test';

test('deleting a todo removes it from the list', async ({ page, request }) => {
  // Seed with two items
  await request.post('/__test__/db/seed', {
    data: {
      todos: [
        { id: 'd1', title: 'ToDelete', description: '', dueDate: '', completed: false },
        { id: 'd2', title: 'KeepMe', description: '', dueDate: '', completed: false },
      ],
    },
  });

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  const todos = page.getByRole('list', { name: 'todos' });
  await expect(todos).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('ToDelete')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('KeepMe')).toBeVisible({ timeout: 15000 });

  // Click delete on the first item
  const row = todos.locator('li').filter({ hasText: 'ToDelete' });
  await row.getByRole('button', { name: 'Delete' }).click();

  // After server deletes and emits, client refetches; 'ToDelete' disappears, 'KeepMe' still visible
  await expect(page.getByText('ToDelete')).toHaveCount(0, { timeout: 15000 } as any);
  await expect(page.getByText('KeepMe')).toBeVisible({ timeout: 15000 });
});

