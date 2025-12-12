"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import AvatarUploader from "./components/AvatarUploader";
import PersonalInfoForm from "./components/PersonalInfoForm";

export default function ProfileSettings() {
  const { user, updateProfile, loading, fetchProfile } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      fetchProfile().catch(() => {
        /* error handled in store */
      });
    }
  }, [fetchProfile, user]);

  useEffect(() => {
    if (user?.firstName) setFirstName(user.firstName);
    if (user?.lastName) setLastName(user.lastName);
  }, [user?.firstName, user?.lastName]);

  const handleSave = async () => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (avatarFile) formData.append("avatar", avatarFile);
    await updateProfile(formData);
  };

  return (
    <div className="bg-white rounded-lg border p-6 sm:p-8 space-y-6 sm:space-y-8 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold">Profile Settings</h2>

      <AvatarUploader avatar={user?.avatar} onFileSelect={setAvatarFile} />

      <hr className="border-gray-200" />

      <h2 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h2>
      <PersonalInfoForm
        firstName={user?.firstName || firstName}
        lastName={user?.lastName || lastName}
        email={user?.email || ""}
        onChange={(field, value) =>
          field === "firstName" ? setFirstName(value) : setLastName(value)
        }
      />

      <Button
        onClick={handleSave}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
