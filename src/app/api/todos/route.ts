import { db } from '../../../lib/database';

export async function GET() {
  await db.read();
  const todos = db.data?.todos ?? [];
  return Response.json(todos, { status: 200 });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const title = typeof body?.title === 'string' ? body.title.trim() : '';

  if (!title) {
    return Response.json({ error: 'title is required' }, { status: 400 });
  }

  await db.read();
  if (!db.data) db.data = { todos: [] };

  const newTodo = {
    id: (globalThis.crypto?.randomUUID?.() || Date.now().toString()) as string,
    title,
    description: '',
    dueDate: '',
    completed: false,
  };

  db.data.todos = [...db.data.todos, newTodo];
  await db.write();

  // In E2E environment, ask dev server to emit websocket event so clients refetch
  if (process.env.E2E_TESTING === '1') {
    try {
      // Absolute URL to reach the same server in tests
      await fetch('http://localhost:3000/__test__/ws/emit/todos-updated', { method: 'POST' });
    } catch {
      // ignore
    }
  }

  return Response.json(newTodo, { status: 201 });
}
