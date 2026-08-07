"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "sms-theme";

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const Ctx = createContext<ThemeCtx>({ theme: "system", setTheme: () => {} });

export const useTheme = () => useContext(Ctx);

/** Resolve "system" to the actual OS preference */
function resolve(theme: Theme): "light" | "dark" {
  if (theme !== "system") return theme;
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Apply a theme by toggling the `dark` class on <html> */
function applyTheme(theme: Theme) {
  const isDark = resolve(theme) === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");

  useEffect(() => {
    // Read persisted preference; fall back to "system"
    const stored = (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
    setThemeState(stored);
    applyTheme(stored);

    // Re-apply whenever the OS preference changes (only matters when theme === "system")
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onSysChange = () => {
      setThemeState((current) => {
        if (current === "system") applyTheme("system");
        return current;
      });
    };
    mq.addEventListener("change", onSysChange);
    return () => mq.removeEventListener("change", onSysChange);
  }, []);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
    applyTheme(t);
  }, []);

  return <Ctx.Provider value={{ theme, setTheme }}>{children}</Ctx.Provider>;
}
