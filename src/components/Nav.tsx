"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme, type Theme } from "@/context/ThemeContext";

/* ── SVG icons ──────────────────────────────────────────────────────────────── */

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MonitorIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

/* ── Theme toggle ────────────────────────────────────────────────────────────── */

const CYCLE: Theme[] = ["system", "light", "dark"];
const LABELS: Record<Theme, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch — render a placeholder until mounted
  useEffect(() => setMounted(true), []);

  const next = () => {
    const idx = CYCLE.indexOf(theme);
    setTheme(CYCLE[(idx + 1) % CYCLE.length]);
  };

  return (
    <button
      className="theme-toggle"
      onClick={next}
      aria-label={mounted ? LABELS[theme] : "Toggle theme"}
      title={mounted ? LABELS[theme] : "Toggle theme"}
    >
      {!mounted || theme === "system" ? <MonitorIcon /> : null}
      {mounted && theme === "light" ? <SunIcon /> : null}
      {mounted && theme === "dark" ? <MoonIcon /> : null}
    </button>
  );
}

/* ── Nav ─────────────────────────────────────────────────────────────────────── */

export default function Nav() {
  const { token, email, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const roleLabel = isAdmin ? "Admin" : "Student";
  const rolePillClass = isAdmin ? "role-pill" : "role-pill role-student";

  const close = () => setOpen(false);

  // Close drawer when viewport grows past mobile breakpoint
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) close(); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <nav className="nav">
      {/* ── Top bar ── */}
      <div className="nav-bar">
        <div className="nav-brand">
          <Link href="/" onClick={close}>
            <span className="nav-brand-icon">&#127891;</span>
            SMS
          </Link>
        </div>

        {/* Desktop links — hidden on mobile */}
        <div className="nav-links">
          {token && <Link href="/courses">Courses</Link>}
          {token && isAdmin && <Link href="/students">Students</Link>}

          {token ? (
            <>
              <div className="nav-divider" />
              <div className="nav-user">
                <span className="nav-user-email">{email}</span>
                <em className={rolePillClass}>{roleLabel}</em>
              </div>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <div className="nav-divider" />
              <Link href="/login"><button>Login</button></Link>
              <Link href="/register">
                <button className="btn-primary">Get Started</button>
              </Link>
            </>
          )}
        </div>

        {/* Trailing controls — always visible */}
        <div className="nav-bar-end">
          <ThemeToggle />

          {/* Hamburger — mobile only */}
          <button
            className={`nav-hamburger${open ? " is-open" : ""}`}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-drawer"
          >
            <span className="bar" />
            <span className="bar" />
            <span className="bar" />
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ── */}
      {open && (
        <div className="nav-drawer" id="nav-drawer" role="menu">
          {token && (
            <div className="nav-drawer-user">
              <span>{email}</span>
              <em className={rolePillClass}>{roleLabel}</em>
            </div>
          )}

          {token && (
            <Link href="/courses" className="nav-drawer-link" onClick={close} role="menuitem">
              Courses
            </Link>
          )}

          {token && isAdmin && (
            <Link href="/students" className="nav-drawer-link" onClick={close} role="menuitem">
              Students
            </Link>
          )}

          {!token && (
            <Link href="/login" className="nav-drawer-link" onClick={close} role="menuitem">
              Login
            </Link>
          )}

          {!token && (
            <Link href="/register" onClick={close}>
              <button className="btn-primary nav-drawer-action">Get Started</button>
            </Link>
          )}

          {token && (
            <button
              className="nav-drawer-action nav-drawer-logout"
              onClick={() => { logout(); close(); }}
              role="menuitem"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
