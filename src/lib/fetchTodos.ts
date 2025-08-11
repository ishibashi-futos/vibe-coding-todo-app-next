import type { Todo } from './database';

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('/api/todos', {
    headers: { Accept: 'application/json' },
    cache: 'no-store' as RequestCache,
  });
  if (!res.ok) throw new Error(`Failed to load todos: ${res.status}`);
  return (await res.json()) as Todo[];
}
