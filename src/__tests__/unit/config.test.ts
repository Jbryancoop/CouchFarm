import { describe, it, expect } from 'vitest';
import { siteConfig, couchStyles, couchColors } from '@/lib/config';

describe('siteConfig', () => {
  it('has required fields', () => {
    expect(siteConfig.name).toBeTruthy();
    expect(siteConfig.tagline).toBeTruthy();
    expect(siteConfig.phone).toBeTruthy();
    expect(siteConfig.email).toBeTruthy();
  });
});

describe('couchStyles', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(couchStyles)).toBe(true);
    expect(couchStyles.length).toBeGreaterThan(0);
  });

  it('each entry has value and label strings', () => {
    for (const style of couchStyles) {
      expect(typeof style.value).toBe('string');
      expect(typeof style.label).toBe('string');
      expect(style.value.length).toBeGreaterThan(0);
      expect(style.label.length).toBeGreaterThan(0);
    }
  });
});

describe('couchColors', () => {
  it('is a non-empty array of strings', () => {
    expect(Array.isArray(couchColors)).toBe(true);
    expect(couchColors.length).toBeGreaterThan(0);
    for (const color of couchColors) {
      expect(typeof color).toBe('string');
    }
  });

  it('does NOT contain removed colors', () => {
    const removed = ['Blue', 'Green', 'Navy', 'Orange', 'Red', 'Beige', 'White'];
    for (const color of removed) {
      expect(couchColors).not.toContain(color);
    }
  });

  it('contains expected colors', () => {
    const expected = ['Black', 'Brown', 'Cream', 'Gray', 'Tan', 'Other'];
    for (const color of expected) {
      expect(couchColors).toContain(color);
    }
  });
});
