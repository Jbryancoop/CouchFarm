/**
 * @couchfarm/types — cross-app type definitions.
 *
 * Server-only deps are intentionally excluded (no `@prisma/client` runtime),
 * so the mobile app can consume these without pulling in node/Prisma.
 */

// ---------------------------------------------------------------------------
// Status unions — canonical source. The web app's lead-input.ts re-exports
// these for backward compatibility with existing imports.
// ---------------------------------------------------------------------------

/** Canonical, ordered inquiry status list. */
export const inquiryStatuses = ["new", "contacted", "converted", "closed"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];

/** Canonical, ordered buy-request status list. */
export const buyRequestStatuses = ["new", "reviewing", "accepted", "declined"] as const;
export type BuyRequestStatus = (typeof buyRequestStatuses)[number];

/** Canonical Couch status list. */
export const couchStatuses = ["available", "pending", "sold"] as const;
export type CouchStatus = (typeof couchStatuses)[number];

/** Role assigned to a User record. */
export type Role = "admin" | "sales";

// ---------------------------------------------------------------------------
// Entity shapes.
//
// These mirror the Prisma schema in apps/web/prisma/schema.prisma but are
// declared by hand so we don't pull `@prisma/client` (a server-only dep) into
// the mobile app. Dates are typed as ISO strings because the API serializes
// `Date` values to strings when JSON-encoding responses.
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  email: string;
  /** Hashed password — never sent over the wire in API responses. */
  password: string;
  name: string;
  role: Role;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouchImage {
  id: string;
  url: string;
  alt: string;
  order: number;
  couchId: string;
}

export interface Couch {
  id: string;
  title: string;
  style: string;
  color: string;
  fabricType: string;
  length: number | null;
  width: number | null;
  height: number | null;
  notes: string | null;
  buyPrice: number | null;
  sellPrice: number | null;
  status: CouchStatus;
  featured: boolean;
  images?: CouchImage[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  preferredStyle: string | null;
  preferredColor: string | null;
  hasSleeper: boolean;
  hasReclining: boolean;
  budgetMin: number | null;
  budgetMax: number | null;
  message: string | null;
  status: InquiryStatus;
  source: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BuyRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  brand: string | null;
  style: string | null;
  color: string | null;
  condition: string | null;
  age: string | null;
  askingPrice: number | null;
  description: string | null;
  /** Stored as a JSON-encoded string in the DB (array of image URLs). */
  images: string | null;
  status: BuyRequestStatus;
  source: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Sale {
  id: string;
  couchId: string | null;
  couchTitle: string;
  sellPrice: number;
  buyPrice: number | null;
  paymentMethod: string;
  soldBy: string | null;
  customerName: string | null;
  notes: string | null;
  source: string | null;
  createdAt: string;
}

export interface MarketingLink {
  id: string;
  name: string;
  slug: string;
  destination: string;
  platform: string | null;
  campaign: string | null;
  clicks: number;
  leads: number;
  sales: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
