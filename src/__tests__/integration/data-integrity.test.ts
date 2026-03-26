import { describe, it, expect } from 'vitest';
import { couchStyles, couchColors, conditions, paymentMethods } from '@/lib/config';

describe('Data Integrity', () => {
  it('style values are unique', () => {
    const values = couchStyles.map(s => s.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it('style labels are unique', () => {
    const labels = couchStyles.map(s => s.label);
    expect(new Set(labels).size).toBe(labels.length);
  });

  it('color values are unique', () => {
    expect(new Set([...couchColors]).size).toBe(couchColors.length);
  });

  it('conditions are defined', () => {
    expect(conditions.length).toBeGreaterThan(0);
    expect(conditions.map(c => c.value)).toContain('excellent');
    expect(conditions.map(c => c.value)).toContain('good');
  });

  it('payment methods are defined', () => {
    expect(paymentMethods.length).toBeGreaterThan(0);
  });

  it('no color has empty string', () => {
    for (const color of couchColors) {
      expect(color.trim().length).toBeGreaterThan(0);
    }
  });

  it('no style has empty value or label', () => {
    for (const style of couchStyles) {
      expect(style.value.trim().length).toBeGreaterThan(0);
      expect(style.label.trim().length).toBeGreaterThan(0);
    }
  });
});
