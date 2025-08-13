/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { TodoList } from '../../src/app/components/TodoList';

describe('TodoList delete button', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('clicking Delete calls DELETE /api/todos/:id', async () => {
    const todos = [{ id: '1', title: 'A', description: '', dueDate: '', completed: false }];

    const calls: any[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: any, init?: any) => {
      calls.push({ input, init });
      return new Response(null, { status: 204 }) as any;
    });

    const container = document.createElement('div');
    const root = createRoot(container);

    await act(async () => {
      root.render(<TodoList todos={todos as any} />);
      await new Promise((r) => setTimeout(r, 0));
    });

    const button = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === 'Delete'
    ) as HTMLButtonElement;
    expect(button).toBeTruthy();

    await act(async () => {
      button.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(calls.length).toBe(1);
    expect(calls[0].input).toBe('/api/todos/1');
    expect(calls[0].init?.method).toBe('DELETE');
  });
});
