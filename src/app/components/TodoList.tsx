import React from 'react';
import type { Todo } from '../../lib/database';

type Props = {
  todos: Todo[];
};

export function TodoList({ todos }: Props) {
  return (
    <ul aria-label="todos">
      {todos.map((t) => (
        <li key={t.id}>
          <input type="checkbox" checked={t.completed} readOnly />
          <span>{t.title}</span>
          <button>Delete</button>
        </li>
      ))}
    </ul>
  );
}
