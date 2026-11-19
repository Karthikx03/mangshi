// Thin fetch wrapper around the Express API. All URLs are relative (/api/...): in dev the
// Vite server proxies them to Express, in production Express serves this app itself.
import type { Recipe, SurplusRow } from "./seasons";
import type { Preorder, SupplyRow } from "./matching";

const BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    method,
    headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return undefined as T;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error ?? `Request failed (${res.status})`);
  return data as T;
}

export type SupplyInput = {
  farmer_name?: string;
  veg_key: string;
  name_zh: string;
  name_en: string;
  kg: number;
  available_from?: string;
  available_to?: string;
};
export type PreorderInput = { campus?: string; portions: number };
export type JoinInput = { name: string; email: string; role: string; note?: string };

export const api = {
  getSystem: () =>
    request<{ supply: SupplyRow[]; preorders: Preorder[]; recipes: Recipe[] }>("GET", "/system"),
  getSeasons: () => request<{ surplus: SurplusRow[]; recipes: Recipe[] }>("GET", "/seasons"),

  addSupply: (data: SupplyInput) => request<SupplyRow>("POST", "/supply", data),
  updateSupply: (id: string, patch: Partial<SupplyInput>) =>
    request<SupplyRow>("PATCH", `/supply/${id}`, patch),
  deleteSupply: (id: string) => request<void>("DELETE", `/supply/${id}`),

  addPreorder: (data: PreorderInput) => request<Preorder>("POST", "/preorders", data),
  updatePreorder: (id: string, patch: Partial<PreorderInput>) =>
    request<Preorder>("PATCH", `/preorders/${id}`, patch),
  deletePreorder: (id: string) => request<void>("DELETE", `/preorders/${id}`),

  submitJoin: (data: JoinInput) => request<{ ok: true; id: string }>("POST", "/join", data),
};
