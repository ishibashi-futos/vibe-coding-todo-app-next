import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IncomingMessage } from 'http';

// Import the shared LowDB instance to control test data
import { db } from '../../src/lib/database';
// Import the API route handler under test
import { GET } from '../../src/app/api/todos/route';

describe('GET /api/todos', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns all todos as JSON array', async () => {
    const seed = [
      {
        id: '1',
        title: 'First',
        description: '',
        dueDate: '2025-01-01',
        completed: false,
      },
      {
        id: '2',
        title: 'Second',
        description: 'more',
        dueDate: '2025-02-02',
        completed: true,
      },
    ];

    // When the route reads from DB, provide our seed data
    vi.spyOn(db, 'read').mockImplementation(async () => {
      db.data = { todos: seed };
    });

    const req = new Request('http://localhost/api/todos');
    const res = await GET(req as unknown as IncomingMessage);

    expect(res.status).toBe(200);
    const body = (await res.json()) as typeof seed;
    expect(Array.isArray(body)).toBe(true);
    expect(body).toHaveLength(2);
    expect(body[0].title).toBe('First');
    expect(body[1].completed).toBe(true);
  });
});

