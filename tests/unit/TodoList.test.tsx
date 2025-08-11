import { describe, it, expect } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { TodoList } from '../../src/app/components/TodoList';

const sample = [
  { id: 'a', title: 'Buy milk', description: '', dueDate: '', completed: false },
  { id: 'b', title: 'Write tests', description: '', dueDate: '', completed: true },
];

describe('TodoList component', () => {
  it('renders checkbox, title text, and delete button for each todo', () => {
    const html = renderToStaticMarkup(<TodoList todos={sample} />);

    // Two checkboxes
    const checkboxMatches = html.match(/type="checkbox"/g) ?? [];
    expect(checkboxMatches.length).toBe(2);

    // Titles are present
    expect(html).toContain('Buy milk');
    expect(html).toContain('Write tests');

    // Two delete buttons
    const deleteMatches = html.match(/>Delete<\/button>/g) ?? [];
    expect(deleteMatches.length).toBe(2);
  });
});
