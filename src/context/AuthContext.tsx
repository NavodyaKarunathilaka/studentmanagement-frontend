"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { api, AUTH_EXPIRED_EVENT } from "@/lib/api";
import type { LoginResponse, Role } from "@/lib/types";

interface AuthState {
  token: string | null;
  role: Role | null;
  email: string | null;
  studentId: number | null;
}

interface AuthContextValue extends AuthState {
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const STORAGE_KEY = "sms-auth";
const EMPTY_STATE: AuthState = { token: null, role: null, email: null, studentId: null };

function readStoredAuth(): AuthState {
  if (typeof window === "undefined") return EMPTY_STATE;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : EMPTY_STATE;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(EMPTY_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage on mount
    setState(readStoredAuth());
    setIsLoading(false);
  }, []);

  // Auto-logout when any API call receives a 401 (expired / invalid token)
  useEffect(() => {
    const handle = () => {
      localStorage.removeItem(STORAGE_KEY);
      setState(EMPTY_STATE);
      router.replace("/login");
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, handle);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handle);
  }, [router]);

  const login = async (email: string, password: string) => {
    const data = await api.post<LoginResponse>("/api/auth/login", { email, password });
    const next: AuthState = {
      token: data.token,
      role: data.role,
      email: data.email,
      studentId: data.id,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setState(next);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(EMPTY_STATE);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ ...state, isAdmin: state.role === "ADMIN", isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
