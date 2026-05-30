import { describe, it, expect } from 'vitest';

// Replicate the filter logic for testing
function applyFilters(
  couches: { style: string; color: string; title: string; fabricType: string }[],
  styles: string[],
  colors: string[],
  search: string
) {
  const q = search.toLowerCase().trim();
  return couches.filter((couch) => {
    if (styles.length > 0 && !styles.includes(couch.style)) return false;
    if (colors.length > 0 && !colors.includes(couch.color)) return false;
    if (q) {
      const haystack = [couch.title, couch.color, couch.fabricType, couch.style]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

const SAMPLE_COUCHES = [
  { style: 'sectional', color: 'Gray', title: 'Modern Sectional', fabricType: 'Linen' },
  { style: 'sofa', color: 'Brown', title: 'Classic Leather Sofa', fabricType: 'Leather' },
  { style: 'loveseat', color: 'Cream', title: 'Cozy Loveseat', fabricType: 'Velvet' },
  { style: 'sectional', color: 'Black', title: 'Large Black Sectional', fabricType: 'Microfiber' },
  { style: 'sleeper', color: 'Tan', title: 'Guest Sleeper', fabricType: 'Cotton' },
];

describe('applyFilters', () => {
  it('returns all couches when no filters are set', () => {
    const result = applyFilters(SAMPLE_COUCHES, [], [], '');
    expect(result).toHaveLength(SAMPLE_COUCHES.length);
  });

  it('filters by a single style', () => {
    const result = applyFilters(SAMPLE_COUCHES, ['sectional'], [], '');
    expect(result).toHaveLength(2);
    expect(result.every((c) => c.style === 'sectional')).toBe(true);
  });

  it('filters by multiple styles (OR logic)', () => {
    const result = applyFilters(SAMPLE_COUCHES, ['sofa', 'loveseat'], [], '');
    expect(result).toHaveLength(2);
    expect(result.every((c) => c.style === 'sofa' || c.style === 'loveseat')).toBe(true);
  });

  it('filters by a single color', () => {
    const result = applyFilters(SAMPLE_COUCHES, [], ['Gray'], '');
    expect(result).toHaveLength(1);
    expect(result[0].color).toBe('Gray');
  });

  it('filters by multiple colors (OR logic)', () => {
    const result = applyFilters(SAMPLE_COUCHES, [], ['Gray', 'Black'], '');
    expect(result).toHaveLength(2);
    expect(result.every((c) => c.color === 'Gray' || c.color === 'Black')).toBe(true);
  });

  it('filters by search matching title', () => {
    const result = applyFilters(SAMPLE_COUCHES, [], [], 'leather');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Classic Leather Sofa');
  });

  it('filters by search matching color', () => {
    const result = applyFilters(SAMPLE_COUCHES, [], [], 'cream');
    expect(result).toHaveLength(1);
    expect(result[0].color).toBe('Cream');
  });

  it('applies combined style + color + search filters', () => {
    const result = applyFilters(SAMPLE_COUCHES, ['sectional'], ['Black'], 'large');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Large Black Sectional');
  });

  it('returns empty array when nothing matches', () => {
    const result = applyFilters(SAMPLE_COUCHES, ['reclining'], ['Pink'], 'nonexistent');
    expect(result).toHaveLength(0);
  });
});
