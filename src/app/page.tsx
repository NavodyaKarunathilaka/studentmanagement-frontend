"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { token, isAdmin, email, isLoading } = useAuth();

  if (isLoading) return null;

  if (!token) {
    return (
      <div className="hero">
        <span className="eyebrow">Student Management System</span>
        <h1 className="hero-title">Run your courses and students in one place.</h1>
        <p className="hero-subtitle">
          A lightweight demo app for managing student records, course catalogs, and
          enrollment — backed by a Spring Boot REST API.
        </p>
        <div className="hero-actions">
          <Link href="/login">
            <button className="btn-primary btn-lg">Login</button>
          </Link>
          <Link href="/register">
            <button className="btn-lg">Create an account</button>
          </Link>
        </div>

        <div className="feature-grid">
          <div className="card">
            <h2>👩‍🎓 Students</h2>
            <p className="muted">Admins can add, update, and remove student records.</p>
          </div>
          <div className="card">
            <h2>📚 Courses</h2>
            <p className="muted">Browse the full course catalog, managed by admins.</p>
          </div>
          <div className="card">
            <h2>✅ Enrollment</h2>
            <p className="muted">Track which students are enrolled in which courses.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Welcome back{email ? `, ${email}` : ""}</h1>
      <p className="muted" style={{ marginBottom: "1.5rem" }}>
        {isAdmin
          ? "You're logged in as an admin. Manage students and courses below."
          : "Browse available courses and check your enrollment status."}
      </p>

      <div className="feature-grid">
        {isAdmin && (
          <Link href="/students" className="dashboard-card">
            <div className="card">
              <h2>👩‍🎓 Students</h2>
              <p className="muted">View, add, update, and delete student records.</p>
            </div>
          </Link>
        )}
        <Link href="/courses" className="dashboard-card">
          <div className="card">
            <h2>📚 Courses</h2>
            <p className="muted">
              {isAdmin
                ? "Create and manage the course catalog."
                : "See all courses and your enrollment status."}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
