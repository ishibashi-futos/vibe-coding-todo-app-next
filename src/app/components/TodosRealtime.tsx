'use client';
import React, { useEffect, useState } from 'react';
import { fetchTodos } from '../../lib/fetchTodos';
import { TodoList } from './TodoList';
import type { Todo } from '../../lib/database';

export function TodosRealtime() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    let active = true;
    // WebSocket is optional during tests; rely on polling + local events
    let socket: unknown = null;

    const load = async () => {
      const data = await fetchTodos();
      if (active) setTodos(data);
    };

    load();
    try {
      // Dynamically import to avoid bundling issues in some environments
      import('socket.io-client')
        .then((m) => {
          socket = m.io();
          socket.on('todos:updated', () => load());
        })
        .catch(() => {
          // ignore — polling + local events will keep data fresh
        });
    } catch {}
    // Also react to local events (e.g., after POST completes)
    const onLocalUpdated = () => load();
    const onOptimistic = (ev: Event) => {
      const e = ev as CustomEvent<Todo>;
      const item = e?.detail;
      if (!item) return;
      setTodos((prev) => {
        if (prev.some((t) => t.id === item.id || t.title === item.title)) return prev;
        return [...prev, item];
      });
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('todos:updated', onLocalUpdated);
      window.addEventListener('todo:optimistic', onOptimistic);
    }

    const timer = setInterval(load, 1000);

    return () => {
      active = false;
      clearInterval(timer);
      if (typeof window !== 'undefined') {
        window.removeEventListener('todos:updated', onLocalUpdated);
        window.removeEventListener('todo:optimistic', onOptimistic);
      }
    };
  }, []);

  return <TodoList todos={todos} />;
}
