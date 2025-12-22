"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import HealthInfoForm from "../profile-settings/components/HealthInfoForm";
import { toast } from "sonner";
import { ApiError } from "@/lib/api";
import { SkeletonForm } from "@/components/ui/skeleton";

export default function HealthInfoSettings() {
  const { user, updateProfile, loading, fetchProfile } = useAuthStore();
  
  // Health Information
  const [hasHealthCondition, setHasHealthCondition] = useState(user?.hasHealthCondition || false);
  const [healthCondition, setHealthCondition] = useState(user?.healthCondition || "");
  const [bloodType, setBloodType] = useState(user?.bloodType || "");
  const [allergies, setAllergies] = useState(user?.allergies || "");
  
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

  // Update form state when user data changes
  useEffect(() => {
    if (user) {
      setHasHealthCondition(user.hasHealthCondition || false);
      setHealthCondition(user.healthCondition || "");
      setBloodType(user.bloodType || "");
      setAllergies(user.allergies || "");
    }
  }, [user]);

  const handleSave = async () => {
    try {
      // Prepare update data (only health fields)
      const updateData: Record<string, string | boolean | null> = {
        hasHealthCondition: hasHealthCondition,
        healthCondition: hasHealthCondition ? (healthCondition.trim() || null) : null,
        bloodType: bloodType.trim() || null,
        allergies: allergies.trim() || null,
      };

      // Use FormData for updates
      const formData = new FormData();
      
      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          if (typeof value === 'boolean') {
            formData.append(key, value ? 'true' : 'false');
          } else {
            formData.append(key, String(value));
          }
        }
      });
      
      await updateProfile(formData);
      
      // Refresh profile to get all updated data from backend
      await fetchProfile();
      
      toast.success("Health information updated successfully");
    } catch (error: unknown) {
      // Extract actual error message from ApiError
      let errorMessage = "Failed to update health information";
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
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Health Information
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Keep your health information updated to ensure you receive the best care and support during your stay.
        </p>
      </div>

      <HealthInfoForm
        hasHealthCondition={hasHealthCondition}
        healthCondition={healthCondition}
        bloodType={bloodType}
        allergies={allergies}
        onChange={(field, value) => {
          if (field === "hasHealthCondition") setHasHealthCondition(value as boolean);
          else if (field === "healthCondition") setHealthCondition(value as string);
          else if (field === "bloodType") setBloodType(value as string);
          else if (field === "allergies") setAllergies(value as string);
        }}
      />

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

