"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!token) router.replace("/login");
  }, [isLoading, token, router]);

  if (isLoading || !token) return <p className="muted">Loading...</p>;

  return <>{children}</>;
}
