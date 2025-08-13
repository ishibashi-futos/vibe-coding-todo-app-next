import { test, expect } from '@playwright/test';

test('toggling does not shift the title start position', async ({ page, request }) => {
  // Seed a single todo
  await request.post('/__test__/db/seed', {
    data: {
      todos: [{ id: 'align1', title: 'Aligned', description: '', dueDate: '', completed: false }],
    },
  });

  await page.goto('/');
  const row = page
    .getByRole('list', { name: 'todos' })
    .locator('li')
    .filter({ hasText: 'Aligned' });
  await expect(row).toBeVisible();

  const title = row.locator('span');
  const before = await title.boundingBox();
  if (!before) throw new Error('Failed to measure before bounding box');

  // Toggle via the emoji button if present, otherwise fall back to checkbox
  const emojiBtn = row.getByRole('button', { name: /☐|✅/ });
  if (await emojiBtn.count()) {
    await emojiBtn.first().click();
  } else {
    await row.getByRole('checkbox').click();
  }

  // Wait for possible rerender
  await page.waitForTimeout(50);
  const after = await title.boundingBox();
  if (!after) throw new Error('Failed to measure after bounding box');

  const dx = Math.abs((after?.x ?? 0) - (before?.x ?? 0));
  expect(dx).toBeLessThan(1.0);
});
