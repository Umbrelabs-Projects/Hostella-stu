"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ProfileSettings from "./profile-settings/ProfileSettings";
import PasswordSettings from "./password-settings/PasswordSettings";
import HealthInfoSettings from "./health-settings/HealthInfoSettings";
import SettingsSidebar from "./components/SettingsSidebar";
import { EmergencyDetails } from "./emergency-details/EmergencyDetails";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

function SettingsContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("profile");
  const isIncomplete = searchParams?.get("incomplete") === "true";

  useEffect(() => {
    if (isIncomplete) {
      toast.error("Please complete your profile before booking", { duration: 5000 });
      // Auto-select the profile tab if incomplete
      setActiveTab("profile");
    }
  }, [isIncomplete]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "password":
        return <PasswordSettings />;
      case "health":
        return <HealthInfoSettings />;
      case "emergency":
        return <EmergencyDetails />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Main Content with animations */}
          <div className="md:flex-1 min-w-0">
            {/* Incomplete Profile Alert */}
            {isIncomplete && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-800">Profile Incomplete</p>
                  <p className="text-sm text-red-700 mt-1">
                    Please complete all required fields in your profile before proceeding with booking.
                    Make sure to fill in your campus, programme, student ID, level, and emergency contact information.
                  </p>
                </div>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab} // important for remounting animation
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
