"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { Student } from "@/lib/types";
import RequireAdmin from "@/components/RequireAdmin";

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
    (async () => {
      await loadStudents();
    })();
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
        <h1>Students</h1>
        <Link href="/students/new">
          <button className="btn-primary">Add Student</button>
        </Link>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="muted">Loading students...</p>
      ) : students.length === 0 ? (
        <p className="muted">No students found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Contact</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.age ?? "-"}</td>
                <td>{s.contactNum ?? "-"}</td>
                <td>
                  <div className="row-actions">
                    <Link href={`/students/${s.id}/edit`}>
                      <button>Edit</button>
                    </Link>
                    <button className="btn-danger" onClick={() => onDelete(s.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
