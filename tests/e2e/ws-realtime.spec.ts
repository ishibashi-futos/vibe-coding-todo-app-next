import { test, expect } from '@playwright/test';

test('home updates list when server emits todos:updated', async ({ page, request }) => {
  let call = 0;
  await page.route('**/api/todos', async (route) => {
    call += 1;
    if (call === 1) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '1', title: 'Alpha', description: '', dueDate: '', completed: false },
        ]),
      });
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { id: '2', title: 'Beta', description: '', dueDate: '', completed: true },
        ]),
      });
    }
  });

  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await expect(page.getByText('Alpha')).toBeVisible({ timeout: 15000 });

  // Ask server to emit the websocket event for all clients
  const res = await request.post('/__test__/ws/emit/todos-updated');
  expect(res.ok()).toBeTruthy();

  // The client should refetch and show updated data
  await expect(page.getByText('Beta')).toBeVisible({ timeout: 15000 });
});
