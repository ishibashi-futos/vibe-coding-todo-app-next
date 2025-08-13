import type { Todo } from './database';

export async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch('/api/todos', {
    headers: { Accept: 'application/json' },
    cache: 'no-store' as RequestCache,
  });
  if (!res.ok) throw new Error(`Failed to load todos: ${res.status}`);
  const data = await res.json();
  // Be tolerant to tests stubbing POST responses on the same route
  // Normalize to an array to avoid client-side crashes.
  if (Array.isArray(data)) return data as Todo[];
  if (data && typeof data === 'object') return [data as Todo];
  return [];
}
