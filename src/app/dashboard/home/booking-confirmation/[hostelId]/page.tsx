"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useBookingStore } from "@/store/useBookingStore";
import { useHostelStore } from "@/store/useHostelStore";
import { Button } from "@/components/ui/button";
import { AlertCircle, Edit, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

type RoomType = 'SINGLE' | 'DOUBLE';

export default function BookingConfirmation() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hostelId = params?.hostelId as string;
  const roomTypeParam = searchParams?.get('type') as RoomType;
  const [preferredRoomType, setPreferredRoomType] = useState<RoomType>(roomTypeParam || 'SINGLE');
  const [loading, setLoading] = useState(false);

  const { user, fetchProfile } = useAuthStore();
  const { createBooking } = useBookingStore();
  const { selectedHostel, fetchHostelById } = useHostelStore();

  useEffect(() => {
    if (hostelId) {
      fetchHostelById(hostelId);
    }
    fetchProfile();
  }, [hostelId, fetchHostelById, fetchProfile]);

  useEffect(() => {
    if (roomTypeParam && (roomTypeParam === 'SINGLE' || roomTypeParam === 'DOUBLE')) {
      setPreferredRoomType(roomTypeParam);
    }
  }, [roomTypeParam]);

  // Check if profile is complete
  const isProfileComplete =
    user?.campus &&
    user?.programme &&
    user?.studentRefNumber &&
    user?.level &&
    user?.emergencyContactName &&
    user?.emergencyContactPhone &&
    user?.emergencyContactRelation;

  const getMissingFields = () => {
    const missing: string[] = [];
    if (!user?.campus) missing.push("Campus");
    if (!user?.programme) missing.push("Programme");
    if (!user?.studentRefNumber) missing.push("Student ID");
    if (!user?.level) missing.push("Level");
    if (!user?.emergencyContactName) missing.push("Emergency Contact Name");
    if (!user?.emergencyContactPhone) missing.push("Emergency Contact Phone");
    if (!user?.emergencyContactRelation) missing.push("Emergency Contact Relation");
    return missing;
  };

  const handleConfirm = async () => {
    if (!isProfileComplete) {
      toast.error("Please complete your profile before booking");
      router.push("/dashboard/settings");
      return;
    }

    if (!hostelId) {
      toast.error("Hostel ID is missing");
      return;
    }

    try {
      setLoading(true);
      const booking = await createBooking({
        hostelId,
        preferredRoomType,
      });

      if (booking) {
        toast.success("Booking created successfully!");
        router.push(`/dashboard/booking/success/${booking.id}`);
      } else {
        toast.error("Failed to create booking");
      }
    } catch (error) {
      console.error("Booking creation failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (!selectedHostel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading hostel details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Booking Confirmation</h1>
          <p className="text-gray-600 mt-2">Review your booking details and profile information</p>
        </motion.div>

        {/* Profile Incomplete Alert */}
        {!isProfileComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Please complete your profile before booking</p>
                <p className="text-sm mt-1 text-red-700">
                  Missing fields: {getMissingFields().join(", ")}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => router.push("/dashboard/settings")}
                className="ml-4"
              >
                <Edit className="w-4 h-4 mr-2" />
                Complete Profile
              </Button>
            </div>
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Booking Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Booking Summary</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Hostel</p>
                <p className="font-semibold">{selectedHostel.name}</p>
                <p className="text-sm text-gray-500">{selectedHostel.location}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Room Type</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={preferredRoomType === 'SINGLE' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreferredRoomType('SINGLE')}
                  >
                    Single Room
                  </Button>
                  <Button
                    variant={preferredRoomType === 'DOUBLE' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreferredRoomType('DOUBLE')}
                  >
                    Double Room
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Booking Period</p>
                <p className="font-semibold">Academic Year 2025/2026</p>
                <p className="text-sm text-gray-500">September 2025 - May 2026</p>
              </div>
            </div>
          </motion.div>

          {/* Profile Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Profile Information</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard/settings")}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              {/* Personal Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Personal</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Name:</span> {user?.firstName} {user?.lastName}</p>
                  <p><span className="text-gray-600">Email:</span> {user?.email || "Not set"}</p>
                  <p><span className="text-gray-600">Phone:</span> {user?.phone || "Not set"}</p>
                </div>
              </div>

              {/* University Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">University</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Campus:</span> {user?.campus || "Not set"}</p>
                  <p><span className="text-gray-600">Programme:</span> {user?.programme || "Not set"}</p>
                  <p><span className="text-gray-600">Level:</span> {user?.level || "Not set"}</p>
                  <p><span className="text-gray-600">Student ID:</span> {user?.studentRefNumber || "Not set"}</p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Emergency Contact</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-600">Name:</span> {user?.emergencyContactName || "Not set"}</p>
                  <p><span className="text-gray-600">Phone:</span> {user?.emergencyContactPhone || "Not set"}</p>
                  <p><span className="text-gray-600">Relation:</span> {user?.emergencyContactRelation || "Not set"}</p>
                </div>
              </div>

              {/* Health Information */}
              {(user?.hasHealthCondition || user?.bloodType || user?.allergies) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Health</h3>
                  <div className="space-y-1 text-sm">
                    {user?.hasHealthCondition && (
                      <p><span className="text-gray-600">Condition:</span> {user?.healthCondition || "Not specified"}</p>
                    )}
                    {user?.bloodType && (
                      <p><span className="text-gray-600">Blood Type:</span> {user?.bloodType}</p>
                    )}
                    {user?.allergies && (
                      <p><span className="text-gray-600">Allergies:</span> {user?.allergies}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 flex justify-end gap-4"
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!isProfileComplete || loading}
            className="min-w-[150px]"
          >
            {loading ? "Creating..." : "Confirm Booking"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

