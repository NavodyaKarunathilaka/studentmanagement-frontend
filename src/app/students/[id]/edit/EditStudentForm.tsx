"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { Course, Student } from "@/lib/types";
import RequireAdmin from "@/components/RequireAdmin";

function EditForm({ id }: { id: string }) {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [enrolledCourse, setEnrolledCourse] = useState<{ id: number; name: string } | null>(null);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const loadStudent = async () => {
    const student = await api.get<Student>(`/api/students/${id}`, token);
    setForm({
      name: student.name,
      email: student.email,
      age: student.age?.toString() ?? "",
    });
    setEnrolledCourse(
      student.courseId != null ? { id: student.courseId, name: student.courseName ?? "" } : null
    );
  };

  useEffect(() => {
    (async () => {
      try {
        const [, courses] = await Promise.all([
          loadStudent(),
          api.get<Course[]>("/api/courses", token),
        ]);
        setAllCourses(courses);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load student");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.put(
        `/api/students/${id}`,
        { name: form.name, email: form.email, age: Number(form.age) },
        token
      );
      router.push("/students");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update student");
    } finally {
      setSaving(false);
    }
  };

  const onEnroll = async () => {
    if (!selectedCourseId) return;
    setEnrollError(null);
    setEnrolling(true);
    try {
      await api.post(`/api/students/${id}/enroll`, { courseId: Number(selectedCourseId) }, token);
      setSelectedCourseId("");
      await loadStudent();
    } catch (err) {
      setEnrollError(err instanceof ApiError ? err.message : "Failed to enroll student");
    } finally {
      setEnrolling(false);
    }
  };

  const availableCourses = allCourses.filter((c) => c.id !== enrolledCourse?.id);

  if (loading) return <p className="muted">Loading student...</p>;

  return (
    <div>
      <h1>Edit Student</h1>
      <form onSubmit={onSubmit}>
        {error && <p className="error">{error}</p>}
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" value={form.name} onChange={onChange("name")} required />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={onChange("email")}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="age">Age</label>
          <input
            id="age"
            type="number"
            value={form.age}
            onChange={onChange("age")}
            required
          />
        </div>
        <div className="actions-bar">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      <div className="card enrollment-section">
        <h2>Enrollment</h2>
        {enrolledCourse === null ? (
          <p className="muted">Not enrolled in any course yet.</p>
        ) : (
          <ul className="enrolled-list">
            <li>
              <span className="badge badge-success">{enrolledCourse.name}</span>
            </li>
          </ul>
        )}

        {enrollError && <p className="error">{enrollError}</p>}

        {availableCourses.length > 0 && (
          <div className="enroll-row">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
            >
              <option value="">Select a course...</option>
              {availableCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <button onClick={onEnroll} disabled={!selectedCourseId || enrolling}>
              {enrolling ? "Enrolling..." : enrolledCourse ? "Switch course" : "Enroll"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EditStudentForm({ id }: { id: string }) {
  return (
    <RequireAdmin>
      <EditForm id={id} />
    </RequireAdmin>
  );
}
