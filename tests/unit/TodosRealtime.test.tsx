/** @vitest-environment jsdom */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

// Mock socket.io-client to control event emission
const handlers: Record<string, Function[]> = {};
vi.mock('socket.io-client', () => ({
  io: () => ({
    on: (event: string, cb: Function) => {
      (handlers[event] ||= []).push(cb);
    },
  }),
}));

// Mock fetchTodos to simulate server data before and after update
let currentData: any[] = [];
vi.mock('../../src/lib/fetchTodos', () => ({
  fetchTodos: vi.fn(async () => currentData),
}));

import { TodosRealtime } from '../../src/app/components/TodosRealtime';

function emit(event: string) {
  (handlers[event] || []).forEach((fn) => fn());
}

describe('TodosRealtime component', () => {
  beforeEach(() => {
    currentData = [];
  });

  it('refetches and re-renders on todos:updated', async () => {
    const container = document.createElement('div');
    const root = createRoot(container);

    // Initial state
    currentData = [
      { id: '1', title: 'Alpha', description: '', dueDate: '', completed: false },
    ];

    await act(async () => {
      root.render(<TodosRealtime />);
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(container.textContent).toContain('Alpha');

    // After update
    currentData = [
      { id: '2', title: 'Beta', description: '', dueDate: '', completed: true },
    ];

    await act(async () => {
      emit('todos:updated');
      await new Promise((r) => setTimeout(r, 0));
    });

    expect(container.textContent).toContain('Beta');
  });
});
