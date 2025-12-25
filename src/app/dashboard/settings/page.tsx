"use client";

import { useState, useEffect, Suspense, useMemo, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import ProfileSettings from "./profile-settings/ProfileSettings";
import PasswordSettings from "./password-settings/PasswordSettings";
import HealthInfoSettings from "./health-settings/HealthInfoSettings";
import SettingsSidebar from "./components/SettingsSidebar";
import { EmergencyDetails } from "./emergency-details/EmergencyDetails";
import { AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

function SettingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, fetchProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [showAlert, setShowAlert] = useState(false);
  const urlIncomplete = searchParams?.get("incomplete") === "true";
  const wasAlertShowingRef = useRef(false);

  // Check if profile is actually complete
  const checkProfileComplete = useMemo(() => {
    if (!user) return { isComplete: false, missingFields: [] };

    const isEmpty = (value: string | null | undefined): boolean => {
      if (value === null || value === undefined) return true;
      if (typeof value === 'string' && value.trim() === '') return true;
      return false;
    };

    const missingFields: string[] = [];
    if (isEmpty(user.campus)) missingFields.push("Campus");
    if (isEmpty(user.programme)) missingFields.push("Programme");
    if (isEmpty(user.studentRefNumber)) missingFields.push("Student ID");
    if (isEmpty(user.level)) missingFields.push("Level");
    if (isEmpty(user.emergencyContactName)) missingFields.push("Emergency Contact Name");
    if (isEmpty(user.emergencyContactPhone)) missingFields.push("Emergency Contact Phone");
    if (isEmpty(user.emergencyContactRelation)) missingFields.push("Emergency Contact Relation");

    return {
      isComplete: missingFields.length === 0,
      missingFields,
    };
  }, [user]);

  // Show/hide alert based on profile completion status and URL param
  useEffect(() => {
    // Only show alert if URL has incomplete param AND profile is actually incomplete
    if (urlIncomplete && !checkProfileComplete.isComplete) {
      setShowAlert(true);
      wasAlertShowingRef.current = true;
      toast.error("Please complete your profile before booking", { duration: 5000 });
      setActiveTab("profile");
    } else if (checkProfileComplete.isComplete) {
      // Profile is complete, always hide alert and remove query param
      const wasShowing = wasAlertShowingRef.current;
      setShowAlert(false);
      wasAlertShowingRef.current = false;
      if (urlIncomplete) {
        router.replace("/dashboard/settings", { scroll: false });
      }
      // Only show success toast if alert was previously showing
      if (wasShowing) {
        toast.success("Profile completed successfully!");
      }
    } else if (!urlIncomplete) {
      // No incomplete param in URL, hide alert
      setShowAlert(false);
      wasAlertShowingRef.current = false;
    }
  }, [urlIncomplete, checkProfileComplete.isComplete, router]);

  // Auto-dismiss alert after 10 seconds
  useEffect(() => {
    if (showAlert && !checkProfileComplete.isComplete) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [showAlert, checkProfileComplete.isComplete]);

  // Fetch profile on mount if needed
  useEffect(() => {
    if (!user) {
      fetchProfile().catch(() => {
        /* error handled in store */
      });
    }
  }, [user, fetchProfile]);

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
            {/* Incomplete Profile Alert - Only show if actually incomplete */}
            <AnimatePresence>
              {showAlert && !checkProfileComplete.isComplete && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-2 border-orange-200 rounded-xl p-5 shadow-lg relative overflow-hidden"
                >
                  {/* Decorative background */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgb(239 68 68) 1px, transparent 0)`,
                      backgroundSize: '24px 24px'
                    }}></div>
                  </div>
                  
                  <div className="relative flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-md">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg mb-1">Profile Incomplete</p>
                          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                            Please complete all required fields in your profile before proceeding with booking.
                          </p>
                          
                          {/* Missing fields as badges */}
                          {checkProfileComplete.missingFields.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {checkProfileComplete.missingFields.map((field, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-orange-200 rounded-full text-xs font-medium text-orange-800 shadow-sm"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                  {field}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Close button */}
                        <button
                          onClick={() => setShowAlert(false)}
                          className="flex-shrink-0 w-8 h-8 rounded-full bg-white/80 hover:bg-white border border-orange-200 flex items-center justify-center transition-colors"
                          aria-label="Dismiss alert"
                        >
                          <X className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
