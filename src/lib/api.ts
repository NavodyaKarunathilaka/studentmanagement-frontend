import type { ApiResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  let body: ApiResponse<T> | undefined;
  try {
    body = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    throw new ApiError(body?.message ?? `Request failed (${res.status})`);
  }

  return body?.data as T;
}

export const api = {
  get: <T>(path: string, token?: string | null) => request<T>(path, { method: "GET" }, token),
  post: <T>(path: string, data: unknown, token?: string | null) =>
    request<T>(path, { method: "POST", body: JSON.stringify(data) }, token),
  put: <T>(path: string, data: unknown, token?: string | null) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(data) }, token),
  delete: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: "DELETE" }, token),
};
