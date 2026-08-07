"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { Student } from "@/lib/types";
import RequireAdmin from "@/components/RequireAdmin";

/* Avatar hue cycles so adjacent rows feel distinct */
const HUES = ["", "teal", "violet", "amber", "success"] as const;

function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

function StudentsList() {
  const { token } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<Student[]>("/api/students", token);
      setStudents(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => { await loadStudents(); })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (id: number) => {
    if (!confirm("Delete this student?")) return;
    try {
      await api.delete(`/api/students/${id}`, token);
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete student");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Students</h1>
          {!loading && students.length > 0 && (
            <p className="muted" style={{ margin: 0, fontSize: "0.85rem" }}>
              {students.length} {students.length === 1 ? "student" : "students"} registered
            </p>
          )}
        </div>
        <Link href="/students/new">
          <button className="btn-primary">+ Add Student</button>
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="muted">Loading students...</p>
      ) : students.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
          <p style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👥</p>
          <p className="muted" style={{ margin: 0 }}>No students registered yet.</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Age</th>
                <th>Contact</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, idx) => {
                const hue = HUES[idx % HUES.length];
                return (
                  <tr key={s.id}>
                    {/* Name cell with avatar */}
                    <td>
                      <div className="student-cell">
                        <div
                          className="student-avatar"
                          data-hue={hue || undefined}
                          aria-hidden="true"
                        >
                          {getInitials(s.name)}
                        </div>
                        <div>
                          <div className="student-name">{s.name}</div>
                          {s.contactNum && (
                            <div className="student-contact">{s.contactNum}</div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                      {s.email}
                    </td>

                    {/* Age */}
                    <td>
                      {s.age != null ? (
                        <span className="chip chip-blue" style={{ fontSize: "0.78rem" }}>
                          {s.age} yrs
                        </span>
                      ) : (
                        <span style={{ color: "var(--muted-light)" }}>—</span>
                      )}
                    </td>

                    {/* Contact — shown here only if not already in avatar sub-line */}
                    <td style={{ color: "var(--text-body)", fontSize: "0.875rem" }}>
                      {s.contactNum ?? <span style={{ color: "var(--muted-light)" }}>—</span>}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="row-actions">
                        <Link href={`/students/${s.id}/edit`}>
                          <button className="btn-edit">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>
                        </Link>
                        <button className="btn-delete" onClick={() => onDelete(s.id)}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" /><path d="M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function StudentsPage() {
  return (
    <RequireAdmin>
      <StudentsList />
    </RequireAdmin>
  );
}
