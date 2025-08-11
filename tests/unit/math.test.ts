import { describe, it, expect } from 'vitest';

// Simple, framework-agnostic sample unit tests
const sum = (a: number, b: number) => a + b;
const isEven = (n: number) => n % 2 === 0;

describe('math helpers', () => {
  it('sum adds numbers', () => {
    expect(sum(1, 2)).toBe(3);
    expect(sum(-1, 1)).toBe(0);
  });

  it('isEven checks parity', () => {
    expect(isEven(2)).toBe(true);
    expect(isEven(3)).toBe(false);
  });
});
