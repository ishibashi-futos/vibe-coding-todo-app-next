'use client';
import React, { useRef, useState } from 'react';

export function AddTodoForm() {
  const [title, setTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault?.();
    const t = (inputRef.current?.value ?? title).trim();
    if (!t) return;

    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ title: t }),
    });

    setTitle('');
    if (inputRef.current) inputRef.current.value = '';
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
      <button type="submit" onClick={() => submit()}>
        追加
      </button>
    </form>
  );
}
