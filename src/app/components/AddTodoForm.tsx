'use client';
import React, { useRef, useState } from 'react';
import type { Todo } from '../../lib/database';

export function AddTodoForm() {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const submittingRef = useRef(false);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    if (submittingRef.current) return;
    submittingRef.current = true;
    const t = (inputRef.current?.value ?? title).trim();
    if (!t) return;

    const resp = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ title: t }),
    });
    let created: unknown = null;
    try {
      created = await resp.json();
    } catch {}
    if (typeof window !== 'undefined') {
      const detail: Todo =
        created && typeof created === 'object'
          ? (created as Todo)
          : { id: `local-${Date.now()}`, title: t, description: '', dueDate: '', completed: false };
      const ev = new CustomEvent<Todo>('todo:optimistic', { detail });
      window.dispatchEvent(ev);
    }

    // Notify listeners (e.g., TodosRealtime) to refresh
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('todos:updated'));
    }

    setTitle('');
    if (inputRef.current) inputRef.current.value = '';
    submittingRef.current = false;
  };

  return (
    <form onSubmit={submit}>
      <input
        type="text"
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="タスク名を入力"
      />
      <button type="submit" onClick={(e) => submit(e)}>
        追加
      </button>
    </form>
  );
}
