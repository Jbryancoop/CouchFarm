import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />,
}));
vi.mock('next/link', () => ({
  default: ({ children, ...props }: any) => <a {...props}>{children}</a>,
}));

describe('FavoriteButton', () => {
  beforeEach(() => {
    const store: Record<string, string> = {};
    vi.stubGlobal('localStorage', {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        Object.keys(store).forEach((k) => delete store[k]);
      }),
      length: 0,
      key: vi.fn(),
    });
  });

  it('renders a button with the correct aria-label', async () => {
    const { default: FavoriteButton } = await import(
      '@/components/FavoriteButton'
    );
    render(<FavoriteButton couchId="test-123" />);
    const button = screen.getByRole('button', { name: /favorites/i });
    expect(button).toBeDefined();
  });
});

describe('BackToTop', () => {
  it('renders a button with the correct aria-label', async () => {
    const { default: BackToTop } = await import('@/components/BackToTop');
    render(<BackToTop />);
    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toBeDefined();
  });
});
