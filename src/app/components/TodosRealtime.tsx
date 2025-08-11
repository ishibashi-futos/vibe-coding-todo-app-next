"use client";
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { fetchTodos } from '../../lib/fetchTodos';
import { TodoList } from './TodoList';
import type { Todo } from '../../lib/database';

export function TodosRealtime() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    let active = true;
    const socket = io();

    const load = async () => {
      const data = (await fetchTodos()) as Todo[];
      if (active) setTodos(data);
    };

    load();
    socket.on('todos:updated', () => {
      load();
    });

    return () => {
      active = false;
    };
  }, []);

  return <TodoList todos={todos} />;
}
