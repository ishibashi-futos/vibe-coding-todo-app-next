/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { AddTodoForm } from '../../src/app/components/AddTodoForm';

describe('AddTodoForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('posts title to /api/todos when submitted', async () => {
    const posted: any[] = [];
    vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: any, init?: any) => {
      posted.push({ input, init });
      return new Response(
        JSON.stringify({
          id: 'x',
          title: JSON.parse(init?.body || '{}').title,
          description: '',
          dueDate: '',
          completed: false,
        }),
        { status: 201, headers: { 'Content-Type': 'application/json' } }
      ) as any;
    });

    const container = document.createElement('div');
    const root = createRoot(container);

    await act(async () => {
      root.render(<AddTodoForm />);
      await new Promise((r) => setTimeout(r, 0));
    });

    const input = container.querySelector('input[type="text"]') as HTMLInputElement;
    const button = Array.from(container.querySelectorAll('button')).find(
      (b) => b.textContent === '追加'
    ) as HTMLButtonElement;

    expect(input).toBeTruthy();
    expect(button).toBeTruthy();

    await act(async () => {
      input.value = 'Test Task';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      button.click();
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(posted.length).toBe(1);
    expect(posted[0].input).toBe('/api/todos');
    expect(posted[0].init?.method).toBe('POST');
    expect(JSON.parse(posted[0].init?.body || '{}').title).toBe('Test Task');
  });
});
