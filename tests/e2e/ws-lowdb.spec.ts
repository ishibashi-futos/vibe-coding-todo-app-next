import { test, expect } from '@playwright/test';

test('home reflects LowDB changes after todos:updated', async ({ page, request }) => {
  // Seed initial data into LowDB via test-only endpoint
  await request.post('/__test__/db/seed', {
    data: {
      todos: [
        { id: '1', title: 'Alpha', description: '', dueDate: '', completed: false },
      ],
    },
  });

  await page.goto('/');
  await expect(page.getByText('Alpha')).toBeVisible();

  // Update DB and trigger websocket event so client refetches
  await request.post('/__test__/db/seed', {
    data: {
      todos: [
        { id: '2', title: 'Beta', description: '', dueDate: '', completed: true },
      ],
    },
  });

  const emitRes = await request.post('/__test__/ws/emit/todos-updated');
  expect(emitRes.ok()).toBeTruthy();

  await expect(page.getByText('Beta')).toBeVisible();
});

