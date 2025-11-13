"use client";

import { useState } from "react";
import ProfileSettings from "./components/ProfileSettings";
import PasswordSettings from "./components/PasswordSettings";
import VerificationSettings from "./components/VerificationSettings";
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
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-6 px-4 py-8">
          {/* Sidebar */}
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main Content */}
          <div className="flex-1 min-w-0">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
