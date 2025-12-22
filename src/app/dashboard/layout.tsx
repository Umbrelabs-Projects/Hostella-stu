"use client";

import React, { useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import SideNav from "./components/layout/sidebar/sideNav";
import Header from "./components/layout/header/Header";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import { useAuthStore } from "@/store/useAuthStore";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { token, user, restoreSession } = useAuthStore();
  const { fetchNotifications } = useNotificationsStore();

  // Set mounted state after initial render to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Verify authentication on mount (only on client)
  useEffect(() => {
    if (!isMounted) return;

    const checkAuth = async () => {
      try {
        // Try to restore session if token exists
        if (!token || !user) {
          await restoreSession();
          const { token: restoredToken, user: restoredUser } = useAuthStore.getState();
          
          // If still no token/user after restore, redirect to login
          if (!restoredToken || !restoredUser) {
            router.replace("/login");
            return;
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.replace("/login");
      }
    };

    checkAuth();
  }, [isMounted, router, restoreSession, token, user]);

  // Fetch notifications when user is authenticated
  useEffect(() => {
    if (isMounted && token && user) {
      fetchNotifications({ page: 1, pageSize: 50 }).catch(() => {
        // Errors are handled in the store
      });
    }
  }, [isMounted, token, user, fetchNotifications]);

  return (
    <div className="flex h-screen flex-col md:flex-row bg-gray-100 ">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 md:w-[25%] bg-white shadow-lg border-r
        transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static`}
      >
        <SideNav closeMenu={() => setIsOpen(false)} />
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Main content area */}
      <div className="flex flex-col w-full">
        <Header onMenuClick={() => setIsOpen(true)} />
        <main className="flex-grow overflow-y-auto p-4  ">{children}</main>
      </div>
    </div>
  );
}
