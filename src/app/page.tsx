"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

/* ── Inline SVG icons ────────────────────────────────────────────────────────── */
function IconUsers() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function IconZap() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconSmartphone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

/* ── Landing page (not authenticated) ────────────────────────────────────────── */
function LandingPage() {
  return (
    <div className="landing">
      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <span className="eyebrow">&#10022; Student Management System</span>

          <h1 className="lp-title">
            The smarter way to manage<br />
            <span>students &amp; courses</span>
          </h1>

          <p className="lp-subtitle">
            A clean, role-based platform for student records, course catalogs,
            and enrollment — backed by a Spring Boot REST API.
          </p>

          <div className="lp-cta-group">
            <Link href="/login">
              <button className="btn-primary btn-lg">
                Get started <IconArrow />
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-lg">Create an account</button>
            </Link>
          </div>

          {/* Trust strip */}
          <div className="lp-trust">
            <span className="lp-trust-item">
              <IconShield /> Role-based access
            </span>
            <span className="lp-trust-sep" />
            <span className="lp-trust-item">
              <IconZap /> Spring Boot API
            </span>
            <span className="lp-trust-sep" />
            <span className="lp-trust-item">
              <IconSmartphone /> Fully responsive
            </span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="lp-features">
        <p className="lp-features-label">What you can do</p>
        <div className="lp-feature-grid">

          <div className="lp-feature-card lp-feat-violet">
            <div className="lp-feature-icon">
              <IconUsers />
            </div>
            <h3>Students</h3>
            <p>
              Admins can register, search, and manage every student record.
              Assign ages, contacts, and course enrollment from one place.
            </p>
          </div>

          <div className="lp-feature-card lp-feat-primary">
            <div className="lp-feature-icon">
              <IconBook />
            </div>
            <h3>Courses</h3>
            <p>
              Browse the full course catalog. Admins can create offerings with
              fees and duration; students can enroll or switch at any time.
            </p>
          </div>

          <div className="lp-feature-card lp-feat-teal">
            <div className="lp-feature-icon">
              <IconCheck />
            </div>
            <h3>Enrollment</h3>
            <p>
              Track exactly which student is in which course. Admins can
              re-assign enrollment; students can self-enroll in seconds.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}

/* ── Dashboard (authenticated) ────────────────────────────────────────────────── */
function Dashboard({ email, isAdmin }: { email: string | null; isAdmin: boolean }) {
  const name = email?.split("@")[0] ?? "there";

  return (
    <div className="dashboard">
      {/* Welcome banner */}
      <div className="dash-banner">
        <div className="dash-banner-avatar" aria-hidden="true">
          {name[0]?.toUpperCase() ?? "?"}
        </div>
        <div className="dash-banner-text">
          <h1>Welcome back, {name}!</h1>
          <p>
            {isAdmin
              ? "You have admin access. Manage students, courses, and enrollment below."
              : "Browse available courses and check your enrollment status."}
          </p>
        </div>
        <span className={isAdmin ? "role-pill" : "role-pill role-student"}>
          {isAdmin ? "Admin" : "Student"}
        </span>
      </div>

      {/* Action cards */}
      <div className="dash-action-label">Quick navigation</div>
      <div className="dash-grid">
        {isAdmin && (
          <Link href="/students" className="dash-card dash-card-violet">
            <div className="dash-card-icon"><IconUsers /></div>
            <div className="dash-card-content">
              <h2>Students</h2>
              <p>View, register, edit, and remove student records. Manage course assignments per student.</p>
            </div>
            <div className="dash-card-arrow"><IconArrow /></div>
          </Link>
        )}

        <Link href="/courses" className="dash-card dash-card-primary">
          <div className="dash-card-icon"><IconBook /></div>
          <div className="dash-card-content">
            <h2>Courses</h2>
            <p>
              {isAdmin
                ? "Create, edit, and remove courses. Set fees and duration for each offering."
                : "Browse the full catalog, see fees and duration, and enroll in a course."}
            </p>
          </div>
          <div className="dash-card-arrow"><IconArrow /></div>
        </Link>
      </div>
    </div>
  );
}

/* ── Page entry point ─────────────────────────────────────────────────────────── */
export default function Home() {
  const { token, isAdmin, email, isLoading } = useAuth();

  if (isLoading) return null;

  if (!token) return <LandingPage />;

  return <Dashboard email={email} isAdmin={isAdmin} />;
}
