"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { user, token, loading, restoreSession } = useAuthStore();

  useEffect(() => {
    const checkAuth = async () => {
      // Wait for store to restore session from localStorage
      await restoreSession();

      // If no token or user, redirect immediately
      if (!user || !token) {
        toast.error("Please sign in to access this page.");
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router, restoreSession, user, token]);

  // Block render completely until authentication is confirmed
  if (loading || !user || !token) {
    return null;
  }

  // Authenticated — render protected content
  return <>{children}</>;
}
