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
    <ul aria-label="todos">
      {todos.map((t) => (
        <li key={t.id}>
          <input
            type="checkbox"
            checked={t.completed}
            onChange={() => toggle(t.id)}
          />
          <span>{t.title}</span>
          <button onClick={() => remove(t.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
