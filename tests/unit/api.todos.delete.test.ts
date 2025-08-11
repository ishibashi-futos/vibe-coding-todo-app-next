import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IncomingMessage } from 'http';

import { db } from '../../src/lib/database';
import { DELETE } from '../../src/app/api/todos/[id]/route';

describe('DELETE /api/todos/[id]', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('removes todo by id and returns 204', async () => {
    const seed = [
      { id: '1', title: 'A', description: '', dueDate: '', completed: false },
      { id: '2', title: 'B', description: '', dueDate: '', completed: true },
    ];

    vi.spyOn(db, 'read').mockImplementation(async () => {
      db.data = { todos: [...seed] } as any;
    });
    const writeSpy = vi.spyOn(db, 'write').mockResolvedValue();

    const req = new Request('http://localhost/api/todos/1', { method: 'DELETE' });
    const res = await DELETE(req as unknown as IncomingMessage, { params: { id: '1' } } as any);

    expect(res.status).toBe(204);
    expect(writeSpy).toHaveBeenCalled();
    expect(db.data?.todos?.some((t) => t.id === '1')).toBe(false);
    expect(db.data?.todos?.some((t) => t.id === '2')).toBe(true);
  });
});

