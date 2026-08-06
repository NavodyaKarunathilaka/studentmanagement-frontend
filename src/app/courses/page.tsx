"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { Course, Student } from "@/lib/types";
import RequireAuth from "@/components/RequireAuth";

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
          try {
            await loadMyCourses();
          } catch {
            setMyCourseId(undefined);
          }
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
            <button className="btn-primary">Add Course</button>
          </Link>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {!isAdmin && (
        <div className="card enrollment-summary">
          <h2>My Enrollment</h2>
          {myCourseId === undefined ? (
            <p className="muted">Your enrollment status couldn&apos;t be loaded right now.</p>
          ) : myCourseId === null ? (
            <p className="muted">You&apos;re not enrolled in any course yet.</p>
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
              <div className="card course-card" key={c.id}>
                <div className="course-card-header">
                  <h2>{c.name}</h2>
                  {!isAdmin && myCourseId !== undefined && (
                    <span className={enrolled ? "badge badge-success" : "badge"}>
                      {enrolled ? "Enrolled" : "Not enrolled"}
                    </span>
                  )}
                </div>
                {c.description && <p className="muted">{c.description}</p>}
                <div className="course-meta">
                  {c.fee !== undefined && <span>Fee(Rs.): {c.fee}</span>}
                  {c.duration !== undefined && <span>Duration: {c.duration} years</span>}
                </div>
                {isAdmin && (
                  <div className="row-actions">
                    <Link href={`/courses/${c.id}/edit`}>
                      <button>Edit</button>
                    </Link>
                    <button className="btn-danger" onClick={() => onDelete(c.id)}>
                      Delete
                    </button>
                  </div>
                )}
                {!isAdmin && !enrolled && (
                  <div className="row-actions">
                    <button
                      className="btn-primary"
                      onClick={() => onEnroll(c.id)}
                      disabled={enrollingId === c.id}
                    >
                      {enrollingId === c.id
                        ? "Enrolling..."
                        : myCourseId
                          ? "Switch to this course"
                          : "Enroll"}
                    </button>
                  </div>
                )}
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
