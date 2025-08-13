import React from 'react';
import type { Todo } from '../../lib/database';

type Props = {
  todos: Todo[];
};

export function TodoList({ todos }: Props) {
  const toggle = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: 'PATCH' });
  };
  const remove = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
  };
  return (
    <ul aria-label="todos" style={{ minHeight: 4 }}>
      {todos.map((t) => (
        <li key={t.id} className="flex items-center gap-3 py-1">
          <input
            type="checkbox"
            checked={t.completed}
            onChange={() => toggle(t.id)}
            className="sr-only"
          />
          <button
            type="button"
            aria-label="Toggle complete"
            onClick={() => toggle(t.id)}
            className="inline-flex w-8 justify-center items-center text-xl leading-none select-none shrink-0"
          >
            {t.completed ? '✅' : '☐'}
          </button>
          <span className="flex-1">{t.title}</span>
          <button
            onClick={() => remove(t.id)}
            className="inline-flex items-center rounded border border-red-300 text-red-600 px-2 py-1 hover:bg-red-50"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
