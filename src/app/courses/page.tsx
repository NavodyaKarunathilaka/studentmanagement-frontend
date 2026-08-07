"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { Course, Student } from "@/lib/types";
import RequireAuth from "@/components/RequireAuth";

/* ── Icons ──────────────────────────────────────────────────────────────────── */
function IconClock() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" /><path d="M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

/* ── Component ──────────────────────────────────────────────────────────────── */
function CoursesList() {
  const { token, isAdmin, studentId } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [myCourseId, setMyCourseId] = useState<number | null | undefined>(undefined);
  const [myCourseName, setMyCourseName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const loadMyCourses = async () => {
    if (!studentId) return;
    const student = await api.get<Student>(`/api/students/${studentId}`, token);
    setMyCourseId(student.courseId ?? null);
    setMyCourseName(student.courseName ?? null);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get<Course[]>("/api/courses", token);
        setCourses(data);
        if (!isAdmin && studentId) {
          try { await loadMyCourses(); }
          catch { setMyCourseId(undefined); }
        }
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load courses");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return;
    try {
      await api.delete(`/api/courses/${id}`, token);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete course");
    }
  };

  const onEnroll = async (courseId: number) => {
    if (!studentId) {
      setEnrollError("Could not determine your student profile. Try logging in again.");
      return;
    }
    setEnrollError(null);
    setEnrollingId(courseId);
    try {
      await api.post(`/api/students/${studentId}/enroll`, { courseId }, token);
      await loadMyCourses();
    } catch (err) {
      setEnrollError(err instanceof ApiError ? err.message : "Failed to enroll in course");
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Courses</h1>
        {isAdmin && (
          <Link href="/courses/new">
            <button className="btn-primary">+ Add Course</button>
          </Link>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {/* My enrollment summary — students only */}
      {!isAdmin && (
        <div className="card enrollment-summary">
          <h2>My Enrollment</h2>
          {myCourseId === undefined ? (
            <p className="muted" style={{ margin: 0 }}>Your enrollment status couldn&apos;t be loaded right now.</p>
          ) : myCourseId === null ? (
            <p className="muted" style={{ margin: 0 }}>You&apos;re not enrolled in any course yet.</p>
          ) : (
            <ul className="enrolled-list">
              <li>
                <span className="badge badge-success">{myCourseName}</span>
              </li>
            </ul>
          )}
        </div>
      )}

      {enrollError && <p className="error">{enrollError}</p>}

      {loading ? (
        <p className="muted">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="muted">No courses available yet.</p>
      ) : (
        <div className="card-grid">
          {courses.map((c) => {
            const enrolled = myCourseId === c.id;
            return (
              <div className={`course-card${enrolled ? " is-enrolled" : ""}`} key={c.id}>
                {/* Colored left accent bar */}
                <div className="course-card-accent" />

                <div className="course-card-body">
                  {/* Header: title + enrollment badge */}
                  <div className="course-card-header">
                    <h2>{c.name}</h2>
                    {!isAdmin && myCourseId !== undefined && (
                      <span className={enrolled ? "badge badge-success" : "badge"}>
                        {enrolled ? "Enrolled" : "Available"}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  {c.description && (
                    <p className="course-card-desc">{c.description}</p>
                  )}

                  {/* Metadata chips */}
                  <div className="course-chips">
                    {c.fee !== undefined && (
                      <span className="chip chip-amber">
                        <IconTag />
                        Rs. {c.fee.toLocaleString()}
                      </span>
                    )}
                    {c.duration !== undefined && (
                      <span className="chip chip-teal">
                        <IconClock />
                        {c.duration} {c.duration === 1 ? "year" : "years"}
                      </span>
                    )}
                  </div>

                  {/* Footer: actions */}
                  <div className="course-card-footer">
                    {isAdmin && (
                      <div className="row-actions" style={{ justifyContent: "flex-start" }}>
                        <Link href={`/courses/${c.id}/edit`}>
                          <button className="btn-edit">
                            <IconEdit /> Edit
                          </button>
                        </Link>
                        <button className="btn-delete" onClick={() => onDelete(c.id)}>
                          <IconTrash /> Delete
                        </button>
                      </div>
                    )}
                    {!isAdmin && !enrolled && (
                      <button
                        className="btn-primary"
                        style={{ width: "100%" }}
                        onClick={() => onEnroll(c.id)}
                        disabled={enrollingId === c.id}
                      >
                        {enrollingId === c.id
                          ? "Enrolling..."
                          : myCourseId
                            ? "Switch to this course"
                            : "Enroll"}
                      </button>
                    )}
                    {!isAdmin && enrolled && (
                      <span className="chip chip-teal" style={{ fontSize: "0.8rem" }}>
                        ✓ Currently enrolled
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CoursesPage() {
  return (
    <RequireAuth>
      <CoursesList />
    </RequireAuth>
  );
}
