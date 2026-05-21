import { describe, it, expect } from 'vitest';
import {
  buildInquiryData,
  validateInquiryData,
  buildBuyRequestData,
  validateBuyRequestData,
} from '@/lib/lead-input';
import { isValidEmail } from '@/lib/form-guard';

describe('buildInquiryData', () => {
  it('prevents mass-assignment of unknown fields', () => {
    const data = buildInquiryData({
      name: 'Jane',
      email: 'jane@example.com',
      id: 'hacked-id',
      createdAt: '2020-01-01',
      leads: 999,
      role: 'admin',
    });
    expect(data.name).toBe('Jane');
    expect(data.email).toBe('jane@example.com');
    expect(data).not.toHaveProperty('id');
    expect(data).not.toHaveProperty('createdAt');
    expect(data).not.toHaveProperty('leads');
    expect(data).not.toHaveProperty('role');
  });

  it('coerces numbers and bools, trims strings, nulls empties', () => {
    const data = buildInquiryData({
      name: '  Jane  ',
      email: 'jane@example.com',
      phone: '',
      budgetMin: '500',
      budgetMax: 1200,
      hasSleeper: 'true',
      hasReclining: 0,
    });
    expect(data.name).toBe('Jane');
    expect(data.phone).toBeNull();
    expect(data.budgetMin).toBe(500);
    expect(data.budgetMax).toBe(1200);
    expect(data.hasSleeper).toBe(true);
    expect(data.hasReclining).toBe(false);
  });

  it('treats the string "false" as false (not Boolean("false") === true)', () => {
    const data = buildInquiryData({
      name: 'Jane',
      email: 'jane@example.com',
      hasSleeper: 'false',
      hasReclining: 'False',
    });
    expect(data.hasSleeper).toBe(false);
    expect(data.hasReclining).toBe(false);
  });

  it('treats boolean true and "true" (any case) as true, "0" as false', () => {
    expect(buildInquiryData({ hasSleeper: true }, { partial: true }).hasSleeper).toBe(true);
    expect(buildInquiryData({ hasSleeper: 'TRUE' }, { partial: true }).hasSleeper).toBe(true);
    expect(buildInquiryData({ hasSleeper: '0' }, { partial: true }).hasSleeper).toBe(false);
  });

  it('partial mode keeps only present keys', () => {
    const data = buildInquiryData({ status: 'contacted' }, { partial: true });
    expect(Object.keys(data)).toEqual(['status']);
  });

  it('non-partial mode always includes required name/email', () => {
    const data = buildInquiryData({});
    expect(data).toHaveProperty('name', '');
    expect(data).toHaveProperty('email', '');
  });
});

describe('validateInquiryData', () => {
  it('accepts valid statuses', () => {
    for (const status of ['new', 'contacted', 'converted', 'closed']) {
      expect(validateInquiryData({ status })).toBeNull();
    }
  });

  it('rejects invalid status enum', () => {
    expect(validateInquiryData({ status: 'bogus' })).toMatch(/Invalid status/);
  });

  it('validates style/color when present', () => {
    expect(validateInquiryData({ preferredStyle: 'sofa' })).toBeNull();
    expect(validateInquiryData({ preferredStyle: 'nope' })).toMatch(/Invalid style/);
    expect(validateInquiryData({ preferredColor: 'Black' })).toBeNull();
    expect(validateInquiryData({ preferredColor: 'Purple' })).toMatch(/Invalid color/);
  });

  it('is lenient when style/color absent or null', () => {
    expect(validateInquiryData({})).toBeNull();
    expect(validateInquiryData({ preferredStyle: null, preferredColor: null })).toBeNull();
  });
});

describe('buildBuyRequestData', () => {
  it('prevents mass-assignment of unknown fields', () => {
    const data = buildBuyRequestData({
      name: 'Bob',
      email: 'bob@example.com',
      id: 'x',
      createdAt: 'y',
      reviewedAt: 'z',
    });
    expect(data.name).toBe('Bob');
    expect(data).not.toHaveProperty('id');
    expect(data).not.toHaveProperty('createdAt');
    expect(data).not.toHaveProperty('reviewedAt');
  });

  it('coerces askingPrice and serializes images', () => {
    const data = buildBuyRequestData({
      name: 'Bob',
      email: 'bob@example.com',
      askingPrice: '450.50',
      images: ['a.jpg', 'b.jpg'],
    });
    expect(data.askingPrice).toBe(450.5);
    expect(data.images).toBe(JSON.stringify(['a.jpg', 'b.jpg']));
  });

  it('keeps string images as-is', () => {
    const data = buildBuyRequestData({ name: 'B', email: 'b@x.com', images: '["a.jpg"]' });
    expect(data.images).toBe('["a.jpg"]');
  });

  it('partial mode keeps only present keys', () => {
    const data = buildBuyRequestData({ adminNotes: 'note' }, { partial: true });
    expect(Object.keys(data)).toEqual(['adminNotes']);
  });
});

describe('validateBuyRequestData', () => {
  it('accepts valid statuses', () => {
    for (const status of ['new', 'reviewing', 'accepted', 'declined']) {
      expect(validateBuyRequestData({ status })).toBeNull();
    }
  });

  it('rejects invalid status enum', () => {
    expect(validateBuyRequestData({ status: 'closed' })).toMatch(/Invalid status/);
  });

  it('validates style/color/condition when present', () => {
    expect(validateBuyRequestData({ style: 'sectional', color: 'Tan', condition: 'good' })).toBeNull();
    expect(validateBuyRequestData({ style: 'nope' })).toMatch(/Invalid style/);
    expect(validateBuyRequestData({ color: 'Magenta' })).toMatch(/Invalid color/);
    expect(validateBuyRequestData({ condition: 'mint' })).toMatch(/Invalid condition/);
  });
});

describe('email validation path', () => {
  it('isValidEmail gates create routes', () => {
    expect(isValidEmail('jane@example.com')).toBe(true);
    expect(isValidEmail('not-an-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});
