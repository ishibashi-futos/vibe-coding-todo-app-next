import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IncomingMessage } from 'http';

import { db } from '../../src/lib/database';

// Dynamic import path for [id] route
import { PATCH } from '../../src/app/api/todos/[id]/route';

describe('PATCH /api/todos/[id]', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('toggles completed for the given id and returns updated item', async () => {
    const seed = [
      { id: '1', title: 'A', description: '', dueDate: '', completed: false },
      { id: '2', title: 'B', description: '', dueDate: '', completed: true },
    ];

    vi.spyOn(db, 'read').mockImplementation(async () => {
      db.data = { todos: seed } as any;
    });
    const writeSpy = vi.spyOn(db, 'write').mockResolvedValue();

    const req = new Request('http://localhost/api/todos/1', { method: 'PATCH' });
    const res = await PATCH(req as unknown as IncomingMessage, { params: { id: '1' } } as any);

    expect(res.status).toBe(200);
    const body = (await res.json()) as any;
    expect(body.id).toBe('1');
    expect(body.completed).toBe(true);
    expect(writeSpy).toHaveBeenCalled();
    expect(db.data?.todos?.find((t) => t.id === '1')?.completed).toBe(true);
  });
});

