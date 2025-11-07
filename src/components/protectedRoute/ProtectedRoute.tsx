"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/login"); // redirect to your login page
    }
  }, [isAuthenticated, loading, router]);

  // Show loader while checking auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Checking authentication...
      </div>
    );
  }

  // Render children if authenticated
  return <>{isAuthenticated ? children : null}</>;
}
