"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { token, isAdmin, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!token) router.replace("/login");
  }, [isLoading, token, router]);

  if (isLoading || !token) return <p>Loading...</p>;

  if (!isAdmin) {
    return (
      <div className="card">
        <h2>Access restricted</h2>
        <p>You are logged in as a regular user. Only admin accounts can manage students.</p>
      </div>
    );
  }

  return <>{children}</>;
}
