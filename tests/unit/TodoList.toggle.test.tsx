/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { TodoList } from '../../src/app/components/TodoList';

describe('TodoList checkbox toggle', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('clicking checkbox calls PATCH /api/todos/:id', async () => {
    const todos = [
      { id: '1', title: 'A', description: '', dueDate: '', completed: false },
    ];

    const calls: any[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: any, init?: any) => {
      calls.push({ input, init });
      return new Response(JSON.stringify({ ...todos[0], completed: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }) as any;
    });

    const container = document.createElement('div');
    const root = createRoot(container);

    await act(async () => {
      root.render(<TodoList todos={todos as any} />);
      await new Promise((r) => setTimeout(r, 0));
    });

    const checkbox = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(checkbox).toBeTruthy();

    await act(async () => {
      checkbox.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(calls.length).toBe(1);
    expect(calls[0].input).toBe('/api/todos/1');
    expect(calls[0].init?.method).toBe('PATCH');
  });
});

