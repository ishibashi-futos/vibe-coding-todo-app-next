import { test, expect } from '@playwright/test';

test('input and buttons have visible, button-like styling', async ({ page }) => {
  // Stub todos so at least one item renders with a Delete button
  await page.route('**/api/todos', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: '1', title: 'Styled item', description: '', dueDate: '', completed: false },
      ]),
    });
  });

  await page.goto('/');

  // Input should have a border and rounded corners
  const input = page.getByPlaceholder('タスク名を入力');
  await expect(input).toBeVisible();
  await expect(input).toHaveAttribute('class', /border/);
  await expect(input).toHaveAttribute('class', /rounded/);

  // Add button should look like a primary button
  const addBtn = page.getByRole('button', { name: '追加' });
  await expect(addBtn).toBeVisible();
  await expect(addBtn).toHaveAttribute('class', /bg-sky-600/);
  await expect(addBtn).toHaveAttribute('class', /rounded/);

  // Delete should clearly look like a button (bordered and rounded)
  const delBtn = page.getByRole('button', { name: 'Delete' });
  await expect(delBtn).toBeVisible();
  await expect(delBtn).toHaveAttribute('class', /border/);
  await expect(delBtn).toHaveAttribute('class', /rounded/);
});
