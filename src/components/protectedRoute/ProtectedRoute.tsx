"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  fallback = null,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { restoreSession } = useAuthStore(); // no more 'user' or 'token'

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await restoreSession();
        const { user, token } = useAuthStore.getState();

        if (!user || !token) {
          toast.error("Please sign in to access this page.");
          router.replace("/login");
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to verify session. Please sign in again.");
        router.replace("/login");
      }
    };

    checkAuth();
  }, [router, restoreSession]);

  if (checkingAuth) return <>{fallback}</>;

  return <>{children}</>;
}
