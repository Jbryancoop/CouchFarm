/**
 * @couchfarm/api-client — typed fetch wrapper for the Couch Farm /api/v1
 * surface. Shared between apps/web (browser) and apps/mobile (Expo / RN).
 *
 * Endpoints themselves don't exist yet — this file types the surface so
 * consumers can be wired up before the server routes land.
 */

import type {
  BuyRequest,
  BuyRequestStatus,
  Couch,
  CustomerInquiry,
  InquiryStatus,
  User,
} from "@couchfarm/types";

// ---------------------------------------------------------------------------
// Public types
// ---------------------------------------------------------------------------

export type TokenGetter = () => string | null | Promise<string | null>;

export interface CreateApiClientOptions {
  /** Base URL of the API host, no trailing slash (e.g. `https://couch.example`). */
  baseUrl: string;
  /**
   * Returns the current auth token (mobile reads from SecureStore; web may
   * return null and rely on cookies once that's wired up). May be async.
   */
  getToken?: TokenGetter;
}

export interface AuthLoginResponse {
  token: string;
  user: User;
  /** ISO 8601 timestamp. */
  expiresAt: string;
}

export interface Page<T> {
  items: T[];
  /** Opaque cursor for the next page, or null when no more results. */
  nextCursor: string | null;
}

export interface ListParams {
  limit?: number;
  cursor?: string;
  sort?: string;
  [key: string]: string | number | undefined;
}

// ---------------------------------------------------------------------------
// ApiError
// ---------------------------------------------------------------------------

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

const V1 = "/api/v1";

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  query?: Record<string, string | number | undefined>;
  body?: unknown;
}

function buildQuery(query?: Record<string, string | number | undefined>): string {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined) params.set(k, String(v));
  }
  const s = params.toString();
  return s ? `?${s}` : "";
}

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ---------------------------------------------------------------------------
// createApiClient
// ---------------------------------------------------------------------------

export function createApiClient(opts: CreateApiClientOptions) {
  const baseUrl = opts.baseUrl.replace(/\/+$/, "");
  const getToken = opts.getToken;

  async function request<T>(path: string, init: RequestOptions = {}): Promise<T> {
    const token = getToken ? await getToken() : null;
    const headers: Record<string, string> = {};

    let body: BodyInit | undefined;
    if (init.body !== undefined && init.body !== null) {
      if (typeof init.body === "string" || init.body instanceof FormData) {
        body = init.body as BodyInit;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(init.body);
      }
    }

    if (token) headers["Authorization"] = `Bearer ${token}`;

    const url = `${baseUrl}${path}${buildQuery(init.query)}`;
    const res = await fetch(url, {
      method: init.method ?? "GET",
      headers,
      body,
    });

    if (!res.ok) {
      const errBody = await parseJsonSafe(res);
      throw new ApiError(
        `API ${init.method ?? "GET"} ${path} failed: ${res.status}`,
        res.status,
        errBody,
      );
    }

    return (await parseJsonSafe(res)) as T;
  }

  return {
    /** Low-level escape hatch — prefer the namespaced methods below. */
    request,

    auth: {
      mobileLogin(input: { email: string; password: string }): Promise<AuthLoginResponse> {
        return request<AuthLoginResponse>(`${V1}/auth/mobile-login`, {
          method: "POST",
          body: input,
        });
      },
      logout(): Promise<void> {
        return request<void>(`${V1}/auth/logout`, { method: "POST" });
      },
    },

    inventory: {
      list(params: ListParams = {}): Promise<Page<Couch>> {
        return request<Page<Couch>>(`${V1}/inventory`, { query: params });
      },
      get(id: string): Promise<Couch> {
        return request<Couch>(`${V1}/inventory/${encodeURIComponent(id)}`);
      },
    },

    inquiries: {
      list(params: ListParams = {}): Promise<Page<CustomerInquiry>> {
        return request<Page<CustomerInquiry>>(`${V1}/inquiries`, { query: params });
      },
      get(id: string): Promise<CustomerInquiry> {
        return request<CustomerInquiry>(`${V1}/inquiries/${encodeURIComponent(id)}`);
      },
      patchStatus(id: string, status: InquiryStatus): Promise<CustomerInquiry> {
        return request<CustomerInquiry>(`${V1}/inquiries/${encodeURIComponent(id)}`, {
          method: "PATCH",
          body: { status },
        });
      },
    },

    buyRequests: {
      list(params: ListParams = {}): Promise<Page<BuyRequest>> {
        return request<Page<BuyRequest>>(`${V1}/buy-requests`, { query: params });
      },
      get(id: string): Promise<BuyRequest> {
        return request<BuyRequest>(`${V1}/buy-requests/${encodeURIComponent(id)}`);
      },
      patchStatus(id: string, status: BuyRequestStatus): Promise<BuyRequest> {
        return request<BuyRequest>(`${V1}/buy-requests/${encodeURIComponent(id)}`, {
          method: "PATCH",
          body: { status },
        });
      },
    },
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
