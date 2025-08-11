import { db } from '../../../../lib/database';

type RouteParams = { id: string } | Promise<{ id: string }>;

export async function PATCH(
  _req: Request,
  context: { params: RouteParams },
) {
  const p = context.params;
  const isPromise = <T,>(v: unknown): v is Promise<T> =>
    typeof (v as { then?: unknown }).then === 'function';
  const awaited = isPromise<{ id: string }>(p) ? await p : (p as { id: string });
  const id: string | undefined = awaited?.id;
  if (!id) return new Response('Bad Request', { status: 400 });

  await db.read();
  if (!db.data) db.data = { todos: [] };
  const idx = db.data.todos.findIndex((t) => t.id === id);
  if (idx === -1) return new Response('Not Found', { status: 404 });

  const current = db.data.todos[idx];
  const updated = { ...current, completed: !current.completed };
  db.data.todos[idx] = updated;
  await db.write();

  try {
    await fetch('http://localhost:3000/__test__/ws/emit/todos-updated', { method: 'POST' });
  } catch {}

  return Response.json(updated, { status: 200 });
}

export async function DELETE(
  _req: Request,
  context: { params: RouteParams },
) {
  const p = context.params;
  const isPromise = <T,>(v: unknown): v is Promise<T> =>
    typeof (v as { then?: unknown }).then === 'function';
  const awaited = isPromise<{ id: string }>(p) ? await p : (p as { id: string });
  const id: string | undefined = awaited?.id;
  if (!id) return new Response('Bad Request', { status: 400 });

  await db.read();
  if (!db.data) db.data = { todos: [] };
  const before = db.data.todos.length;
  db.data.todos = db.data.todos.filter((t) => t.id !== id);
  if (db.data.todos.length === before) return new Response('Not Found', { status: 404 });
  await db.write();

  try {
    await fetch('http://localhost:3000/__test__/ws/emit/todos-updated', { method: 'POST' });
  } catch {}

  return new Response(null, { status: 204 });
}
