"use client";

import { useState } from "react";
import ProfileSettings from "./profile-settings/ProfileSettings";
import PasswordSettings from "./password-settings/PasswordSettings";
import VerificationSettings from "./verification/VerificationSettings";
import SettingsSidebar from "./components/SettingsSidebar";
import { EmergencyDetails } from "./emergency-details/EmergencyDetails";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "password":
        return <PasswordSettings />;
      case "emergency":
        return <EmergencyDetails />;
      case "verification":
        return <VerificationSettings />;
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Main Content */}
          <div className="md:flex-1 min-w-0">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
