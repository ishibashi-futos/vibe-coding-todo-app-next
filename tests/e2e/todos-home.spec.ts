import { test, expect } from '@playwright/test';

test('home shows todos from /api/todos', async ({ page }) => {
  // Stub API to return predictable data
  await page.route('**/api/todos', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 'a', title: 'Buy milk', description: '', dueDate: '', completed: false },
        { id: 'b', title: 'Write tests', description: '', dueDate: '', completed: true },
      ]),
    });
  });

  await page.goto('/');

  await expect(page.getByText('Buy milk')).toBeVisible();
  await expect(page.getByText('Write tests')).toBeVisible();
});

