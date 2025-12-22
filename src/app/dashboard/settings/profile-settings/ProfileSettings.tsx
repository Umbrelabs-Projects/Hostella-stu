"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import AvatarUploader from "./components/AvatarUploader";
import PersonalInfoForm from "./components/PersonalInfoForm";
import UniversityInfoForm from "./components/UniversityInfoForm";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { SkeletonForm } from "@/components/ui/skeleton";

export default function ProfileSettings() {
  const { user, updateProfile, loading, fetchProfile } = useAuthStore();
  
  // Basic Information
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  
  // University Information
  const [campus, setCampus] = useState("");
  const [programme, setProgramme] = useState("");
  const [studentRefNumber, setStudentRefNumber] = useState("");
  const [level, setLevel] = useState("");
  
  const [initialLoading, setInitialLoading] = useState(true);
  
  // Debug: Log when component renders
  console.log("ProfileSettings: Component render", {
    hasUser: !!user,
    userCampus: user?.campus,
    userProgramme: user?.programme,
    stateCampus: campus,
    stateProgramme: programme,
  });

  // Always fetch profile on mount to ensure fresh data
  useEffect(() => {
    const loadProfile = async () => {
      setInitialLoading(true);
      try {
        console.log("ProfileSettings: Fetching complete profile...");
        await fetchProfile();
        // Small delay to ensure store is updated before we check user
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log("ProfileSettings: Profile fetched successfully", user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setInitialLoading(false);
      }
    };
    loadProfile();
  }, [fetchProfile]);

  // Update form state when user data changes
  useEffect(() => {
    if (user) {
      console.log("ProfileSettings: Loading user data", user);
      console.log("ProfileSettings: University fields check", {
        campus: user.campus,
        programme: user.programme,
        studentRefNumber: user.studentRefNumber,
        level: user.level,
        // Check for alternative field names (in case backend uses different names)
        school: (user as any).school,
        studentId: (user as any).studentId,
        // Check if programme field exists in response
        hasProgramme: 'programme' in user,
        programmeType: typeof user.programme,
        programmeValue: user.programme,
        // Check all user keys to see what fields are present
        allUserKeys: Object.keys(user),
      });
      // Use nullish coalescing to preserve null values, but default to empty string for display
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setPhone(user.phone ?? "");
      // Try both field names in case backend uses different names
      setCampus(user.campus ?? (user as any).school ?? "");
      setProgramme(user.programme ?? "");
      setStudentRefNumber(user.studentRefNumber ?? (user as any).studentId ?? "");
      setLevel(user.level ?? "");
      
      console.log("ProfileSettings: State updated", {
        firstName: user.firstName ?? "",
        lastName: user.lastName ?? "",
        phone: user.phone ?? "",
        campus: user.campus ?? (user as any).school ?? "",
        programme: user.programme ?? "",
        studentRefNumber: user.studentRefNumber ?? (user as any).studentId ?? "",
        level: user.level ?? "",
      });
    } else {
      // Reset to empty if user is null
      setFirstName("");
      setLastName("");
      setPhone("");
      setCampus("");
      setProgramme("");
      setStudentRefNumber("");
      setLevel("");
    }
  }, [user]);

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

      // Validate required fields
      if (!firstName.trim()) {
        toast.error("First name is required");
        return;
      }
      if (!lastName.trim()) {
        toast.error("Last name is required");
        return;
      }

      // Prepare update data (only profile and university fields)
      const updateData: Record<string, string | null> = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || null,
        campus: campus.trim() || null,
        programme: programme.trim() || null,
        studentRefNumber: studentRefNumber.trim() || null,
        level: level.trim() || null,
      };

      // Use FormData for all updates
      const formData = new FormData();
      
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });
      
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      
      await updateProfile(formData);
      
      // Refresh profile to get all updated data from backend
      await fetchProfile();
      
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

      {/* Avatar Upload */}
      <AvatarUploader avatar={user?.avatar} onFileSelect={setAvatarFile} />

      <hr className="border-gray-200" />

      {/* Personal Information */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
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
      </div>

      <hr className="border-gray-200" />

      {/* University Information */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          University Information
        </h2>
        <UniversityInfoForm
          campus={campus}
          programme={programme}
          studentRefNumber={studentRefNumber}
          level={level}
          onChange={(field, value) => {
            if (field === "campus") setCampus(value);
            else if (field === "programme") setProgramme(value);
            else if (field === "studentRefNumber") setStudentRefNumber(value);
            else if (field === "level") setLevel(value);
          }}
        />
      </div>

      {/* Save Button */}
      <div className="pt-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
