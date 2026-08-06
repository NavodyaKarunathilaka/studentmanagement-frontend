"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import RequireAdmin from "@/components/RequireAdmin";

function NewCourseForm() {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", description: "", fee: "", duration: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post(
        "/api/courses",
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
      setError(err instanceof ApiError ? err.message : "Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Course</h1>
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
          <label htmlFor="fee">Fee (Rs.)</label>
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
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewCoursePage() {
  return (
    <RequireAdmin>
      <NewCourseForm />
    </RequireAdmin>
  );
}
