import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import TodosPage from '../../src/app/todos/page';

describe('/todos page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('does not perform server-side fetch and renders without error', async () => {
    const spy = vi.spyOn(globalThis, 'fetch');
    const html = renderToStaticMarkup(await (TodosPage as any)());
    expect(typeof html).toBe('string');
    expect(spy).not.toHaveBeenCalled();
  });
});
