import type { ApiResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
  }
}

/** Fired when the server returns 401 — AuthProvider listens and auto-logs out. */
export const AUTH_EXPIRED_EVENT = "sms:auth-expired";

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
    if (res.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }
    throw new ApiError(body?.message ?? `Request failed (${res.status})`, res.status);
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
