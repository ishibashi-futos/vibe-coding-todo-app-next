import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IncomingMessage } from 'http';

import { db } from '../../src/lib/database';
import { POST } from '../../src/app/api/todos/route';

describe('POST /api/todos', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a new todo with title and returns 201', async () => {
    // Seed DB state when read() is called
    vi.spyOn(db, 'read').mockImplementation(async () => {
      db.data = { todos: [] } as any;
    });

    const writeSpy = vi.spyOn(db, 'write').mockResolvedValue();

    const payload = { title: 'New Task' };
    const req = new Request('http://localhost/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const res = await POST(req as unknown as IncomingMessage);
    expect(res.status).toBe(201);

    const created = (await res.json()) as any;
    expect(created).toMatchObject({
      title: 'New Task',
      completed: false,
      description: '',
      dueDate: '',
    });
    expect(typeof created.id).toBe('string');

    // Ensure it wrote to DB and appended the item
    expect(writeSpy).toHaveBeenCalled();
    expect(db.data?.todos?.some((t) => t.id === created.id && t.title === 'New Task')).toBe(true);
  });
});
