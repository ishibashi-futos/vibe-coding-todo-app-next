/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { AddTodoForm } from '../../src/app/components/AddTodoForm';

describe('AddTodoForm input clears after add', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('clears the input value after successful submit', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({ id: 'n1', title: 'X', description: '', dueDate: '', completed: false }),
        { status: 201, headers: { 'Content-Type': 'application/json' } },
      ) as any,
    );

    const container = document.createElement('div');
    const root = createRoot(container);

    await act(async () => {
      root.render(<AddTodoForm />);
      await new Promise((r) => setTimeout(r, 0));
    });

    const input = container.querySelector('input[type="text"]') as HTMLInputElement;
    const button = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === '追加',
    ) as HTMLButtonElement;

    input.value = 'Hello';
    await act(async () => {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      button.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(input.value).toBe('');
  });
});

