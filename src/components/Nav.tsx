"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Nav() {
  const { token, email, isAdmin, logout } = useAuth();
  const roleLabel = isAdmin ? "Admin" : "Student";

  return (
    <nav className="nav">
      <div className="nav-brand">
        <Link href="/">🎓 Student Management</Link>
      </div>
      <div className="nav-links">
        {token && <Link href="/courses">Courses</Link>}
        {token && isAdmin && <Link href="/students">Students</Link>}
        {token ? (
          <>
            <span className="nav-user">
              {email} <em className="role-pill">{roleLabel}</em>
            </span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button>Login</button>
            </Link>
            <Link href="/register">
              <button className="btn-primary">Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
