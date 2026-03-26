import { describe, it, expect } from 'vitest';
import { couchStyles, couchColors } from '@/lib/config';

const validStyles = couchStyles.map((s) => s.value);
const validColors: readonly string[] = couchColors;

describe('API Validation Rules', () => {
  describe('Style validation', () => {
    it('accepts all defined styles', () => {
      for (const style of validStyles) {
        expect(validStyles.includes(style)).toBe(true);
      }
    });

    it('rejects invalid styles', () => {
      expect(validStyles.includes('invalid_style')).toBe(false);
      expect(validStyles.includes('')).toBe(false);
    });

    it('includes expected styles', () => {
      expect(validStyles).toContain('sofa');
      expect(validStyles).toContain('sectional');
      expect(validStyles).toContain('u_shape');
      expect(validStyles).toContain('l_shape');
      expect(validStyles).toContain('reclining');
      expect(validStyles).toContain('sleeper');
    });
  });

  describe('Color validation', () => {
    it('accepts all defined colors', () => {
      for (const color of validColors) {
        expect(validColors.includes(color)).toBe(true);
      }
    });

    it('rejects removed colors', () => {
      const removed = ['Blue', 'Green', 'Navy', 'Orange', 'Red', 'Beige', 'White'];
      for (const color of removed) {
        expect(validColors.includes(color)).toBe(false);
      }
    });

    it('rejects invalid colors', () => {
      expect(validColors.includes('Purple')).toBe(false);
      expect(validColors.includes('')).toBe(false);
    });
  });
});
