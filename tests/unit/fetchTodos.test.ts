import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchTodos } from '../../src/lib/fetchTodos';

describe('fetchTodos', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('calls /api/todos and returns parsed array', async () => {
    const data = [
      { id: '1', title: 'A', description: '', dueDate: '', completed: false },
      { id: '2', title: 'B', description: '', dueDate: '', completed: true },
    ];

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }) as any,
    );

    const todos = await fetchTodos();
    expect(todos).toEqual(data);

    expect(fetch).toHaveBeenCalledWith('/api/todos', expect.any(Object));
  });
});

