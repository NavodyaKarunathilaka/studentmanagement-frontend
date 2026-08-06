"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { Course } from "@/lib/types";
import RequireAdmin from "@/components/RequireAdmin";

function EditForm({ id }: { id: string }) {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", fee: "", duration: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const course = await api.get<Course>(`/api/courses/${id}`, token);
        setForm({
          name: course.name,
          description: course.description ?? "",
          fee: course.fee?.toString() ?? "",
          duration: course.duration?.toString() ?? "",
        });
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Failed to load course");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, token]);

  const onChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await api.put(
        `/api/courses/${id}`,
        {
          name: form.name,
          description: form.description,
          fee: Number(form.fee),
          duration: Number(form.duration),
        },
        token
      );
      router.push("/courses");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to update course");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="muted">Loading course...</p>;

  return (
    <div>
      <h1>Edit Course</h1>
      <form onSubmit={onSubmit}>
        {error && <p className="error">{error}</p>}
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" value={form.name} onChange={onChange("name")} required />
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <input
            id="description"
            value={form.description}
            onChange={onChange("description")}
          />
        </div>
        <div className="field">
          <label htmlFor="fee">Fee(Rs.)</label>
          <input id="fee" type="number" value={form.fee} onChange={onChange("fee")} required />
        </div>
        <div className="field">
          <label htmlFor="duration">Duration (years)</label>
          <input
            id="duration"
            type="number"
            value={form.duration}
            onChange={onChange("duration")}
            required
          />
        </div>
        <div className="actions-bar">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditCourseForm({ id }: { id: string }) {
  return (
    <RequireAdmin>
      <EditForm id={id} />
    </RequireAdmin>
  );
}
