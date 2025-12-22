"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import AvatarUploader from "./components/AvatarUploader";
import PersonalInfoForm from "./components/PersonalInfoForm";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { SkeletonForm, Skeleton } from "@/components/ui/skeleton";

export default function ProfileSettings() {
  const { user, updateProfile, loading, fetchProfile } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Always fetch profile on mount to ensure fresh data
  useEffect(() => {
    const loadProfile = async () => {
      setInitialLoading(true);
      try {
        await fetchProfile();
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (user?.firstName) setFirstName(user.firstName);
    if (user?.lastName) setLastName(user.lastName);
    if (user?.phone) setPhone(user.phone);
  }, [user?.firstName, user?.lastName, user?.phone]);

  const handleSave = async () => {
    try {
      // Validate avatar file if provided
      if (avatarFile) {
        // Check file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (avatarFile.size > maxSize) {
          toast.error("Avatar image must be less than 5MB");
          return;
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(avatarFile.type)) {
          toast.error("Only image files (JPEG, JPG, PNG, GIF, WEBP) are allowed");
          return;
        }
      }

      const formData = new FormData();
      if (firstName) formData.append("firstName", firstName);
      if (lastName) formData.append("lastName", lastName);
      if (phone) formData.append("phone", phone);
      if (avatarFile) formData.append("avatar", avatarFile);
      
      // Check if at least one field is being updated
      if (!firstName && !lastName && !phone && !avatarFile) {
        toast.error("Please provide at least one field to update");
        return;
      }
      
      // Debug: Log FormData contents
      console.log("Sending profile update:", {
        firstName,
        lastName,
        phone,
        hasAvatar: !!avatarFile,
        avatarSize: avatarFile?.size,
      });
      
      await updateProfile(formData);
      toast.success("Profile updated successfully");
      setAvatarFile(null); // Clear file after successful upload
    } catch (error: unknown) {
      // Extract actual error message from ApiError
      let errorMessage = "Failed to update profile";
      if (error instanceof ApiError) {
        errorMessage = error.message || errorMessage;
        console.error("API Error:", error.message, "Status:", error.statusCode);
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
        console.error("Error:", error.message);
      }
      toast.error(errorMessage);
      console.error("Full error object:", error);
    }
  };

  // Show skeleton while loading
  if (initialLoading) {
    return (
      <div className="bg-white rounded-lg border p-6 sm:p-8 space-y-6 sm:space-y-8 max-w-3xl mx-auto">
        <SkeletonForm fields={4} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border p-6 sm:p-8 space-y-6 sm:space-y-8 max-w-3xl mx-auto">
      <h2 className="text-lg font-semibold">Profile Settings</h2>

      <AvatarUploader avatar={user?.avatar} onFileSelect={setAvatarFile} />

      <hr className="border-gray-200" />

      <h2 className="text-lg font-semibold text-gray-900">
        Personal Information
      </h2>
      <PersonalInfoForm
        firstName={firstName}
        lastName={lastName}
        phone={phone}
        email={user?.email || ""}
        onChange={(field, value) => {
          if (field === "firstName") setFirstName(value);
          else if (field === "lastName") setLastName(value);
          else if (field === "phone") setPhone(value);
        }}
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
