"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import RequireAdmin from "@/components/RequireAdmin";

function NewStudentForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", contactNum: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.post("/api/auth/register", form);
      router.push("/students");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <h1>Add Student</h1>
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={form.password}
            onChange={onChange("password")}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="contactNum">Contact Number</label>
          <input
            id="contactNum"
            value={form.contactNum}
            onChange={onChange("contactNum")}
            required
          />
        </div>
        <div className="actions-bar">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Saving..." : "Create Student"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NewStudentPage() {
  return (
    <RequireAdmin>
      <NewStudentForm />
    </RequireAdmin>
  );
}
