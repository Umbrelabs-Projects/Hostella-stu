"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuthStore } from "@/store/useAuthStore";
import { useHostelStore } from "@/store/useHostelStore";
import { useBookingStore } from "@/store/useBookingStore";
import { ApiError } from "@/lib/api";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton";

type RoomType = 'SINGLE' | 'DOUBLE';

function ExtraBookingDetailsContent() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const hostelId = id as string;
  const roomTypeParam = (searchParams?.get('type') as RoomType) || 'SINGLE';
  
  const [loading, setLoading] = useState(false);
  const { user, fetchProfile, extraBookingDetails, updateExtraBookingDetails } = useAuthStore();
  const { selectedHostel, loading: hostelLoading, error: hostelError, fetchHostelById } = useHostelStore();
  const { createBooking } = useBookingStore();

  useEffect(() => {
    if (hostelId) {
      fetchHostelById(hostelId);
    }
    fetchProfile();
  }, [hostelId, fetchHostelById, fetchProfile]);

  // Silently retry on error
  useEffect(() => {
    if (hostelId && hostelError && !hostelLoading) {
      const retryTimer = setTimeout(() => {
        fetchHostelById(hostelId);
      }, 2000); // Retry after 2 seconds
      return () => clearTimeout(retryTimer);
    }
  }, [hostelId, hostelError, hostelLoading, fetchHostelById]);

  // Helper to check if profile is complete
  const checkProfileComplete = () => {
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
  };

  const profileStatus = checkProfileComplete();

  // Get room type data from hostel
  const roomTypes = selectedHostel?.roomTypes || [];
  const selectedRoomType = roomTypes.find(
    rt => (roomTypeParam === 'SINGLE' && (rt.type === 'One-in-one' || rt.title === 'One-in-one' || rt.value === 'SINGLE')) ||
          (roomTypeParam === 'DOUBLE' && (rt.type === 'Two-in-one' || rt.title === 'Two-in-one' || rt.value === 'DOUBLE'))
  );

  // Use the 'value' field from roomTypes (required by backend) or map from type/title
  // Backend requires "SINGLE" or "DOUBLE" - must use the value field from roomTypes array
  // If value is not available, map from type: "One-in-one" → "SINGLE", "Two-in-one" → "DOUBLE"
  let preferredRoomTypeValue: 'SINGLE' | 'DOUBLE';
  if (selectedRoomType?.value) {
    preferredRoomTypeValue = selectedRoomType.value as 'SINGLE' | 'DOUBLE';
  } else if (selectedRoomType?.type === 'One-in-one' || selectedRoomType?.title === 'One-in-one') {
    preferredRoomTypeValue = 'SINGLE';
  } else if (selectedRoomType?.type === 'Two-in-one' || selectedRoomType?.title === 'Two-in-one') {
    preferredRoomTypeValue = 'DOUBLE';
  } else {
    // Fallback to roomTypeParam (should already be 'SINGLE' or 'DOUBLE')
    preferredRoomTypeValue = roomTypeParam;
  }

  const roomTitle = selectedRoomType?.title || (roomTypeParam === 'SINGLE' ? 'One-in-one' : 'Two-in-one');
  const price = typeof selectedRoomType?.price === 'number' 
    ? selectedRoomType.price.toString() 
    : selectedRoomType?.price?.min?.toString() || '0';

  const bookingDetails = {
    hostelName: selectedHostel?.name || '',
    roomTitle: roomTitle,
    price: price,
    bookingId: extraBookingDetails.bookingId,
  };

  const handleConfirm = async () => {
    if (!selectedHostel || !selectedHostel.id) {
      toast.error("Hostel information is missing");
      return;
    }

    // Check profile completeness before creating booking
    if (!profileStatus.isComplete) {
      toast.error(
        `Please complete your profile before booking. Missing: ${profileStatus.missingFields.join(", ")}`,
        { duration: 5000 }
      );
      router.push("/dashboard/settings?incomplete=true");
      return;
    }

    try {
      setLoading(true);
      
      // Update extra booking details (for reference)
      updateExtraBookingDetails(bookingDetails);

      // Use selectedHostel.id (the actual UUID from backend) instead of URL param
      // The URL param might not be in UUID format
      const actualHostelId = selectedHostel.id;

      // Prepare booking payload - MUST use the 'value' field from roomTypes (backend requirement)
      const bookingPayload = {
        hostelId: actualHostelId,
        preferredRoomType: preferredRoomTypeValue, // Use 'value' from roomTypes: "SINGLE" or "DOUBLE"
      };

      console.log("=== Booking Creation Debug ===");
      console.log("hostelId (from URL param):", hostelId);
      console.log("selectedHostel.id (actual UUID):", actualHostelId);
      console.log("roomTypeParam (from URL):", roomTypeParam);
      console.log("selectedRoomType:", selectedRoomType);
      console.log("selectedRoomType?.value:", selectedRoomType?.value);
      console.log("preferredRoomTypeValue (final):", preferredRoomTypeValue);
      console.log("bookingPayload:", JSON.stringify(bookingPayload, null, 2));
      console.log("roomTypes array:", roomTypes);
      console.log("==============================");

      // Create booking using the API
      const booking = await createBooking(bookingPayload);

      if (booking) {
        toast.success("Booking created successfully!");
        router.push("/dashboard/booking");
      } else {
        toast.error("Failed to create booking");
      }
    } catch (error: unknown) {
      console.error("Booking creation failed:", error);
      
      // Extract error message from ApiError if available
      let errorMessage = "Failed to create booking";
      if (error instanceof ApiError) {
        errorMessage = error.message;
        if (error.errors) {
          const errorDetails = Object.entries(error.errors)
            .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
            .join('; ');
          errorMessage = `${error.message}. ${errorDetails}`;
        }
        console.error("API Error details:", {
          message: error.message,
          statusCode: error.statusCode,
          errors: error.errors,
        });
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setLoading(false);
    }
  };

  if (hostelLoading || !selectedHostel) {
    return (
      <div className="px-3 md:px-8 flex justify-center py-10">
        <SkeletonCard />
      </div>
    );
  }

  // If there's an error, show loading skeleton (will retry automatically)
  // This provides a better UX than showing error immediately
  if (hostelError) {
    return (
      <div className="px-3 md:px-8 flex justify-center py-10">
        <SkeletonCard />
      </div>
    );
  }

  return (
    <section className="px-3 md:px-8 flex flex-col items-center py-8 md:py-12">
      <div className="w-full max-w-4xl space-y-6">
        {/* Profile Incomplete Warning - Top of page */}
        {!profileStatus.isComplete && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-red-900">Complete Your Profile</p>
                <p className="text-sm text-red-700 mt-1">
                  Please complete the following fields before booking: <span className="font-medium">{profileStatus.missingFields.join(", ")}</span>
                </p>
                <button
                  onClick={() => router.push("/dashboard/settings?incomplete=true")}
                  className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-red-700 hover:text-red-800 bg-red-100 hover:bg-red-200 px-4 py-2 rounded-lg transition-colors"
                >
                  Go to Settings
                  <span>→</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Booking Summary Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header with Image */}
          <div className="relative h-48 md:h-64 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600">
            {selectedHostel.image && (
              <Image
                src={selectedHostel.image}
                alt={selectedHostel.name}
                fill
                className="object-cover opacity-90"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {selectedHostel.name}
              </h1>
              <p className="text-yellow-200 text-sm md:text-base">
                {selectedHostel.location || selectedHostel.campus}
              </p>
            </div>
          </div>

          {/* Booking Details */}
          <div className="p-6 md:p-8">
            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Room Type</span>
                    <span className="font-semibold text-gray-900">{roomTitle}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Price</span>
                    <span className="text-2xl font-bold text-gray-900">GHC {parseFloat(price).toLocaleString()}</span>
                  </div>
                  {selectedHostel.facilities && selectedHostel.facilities.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-600 mb-2">Facilities</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedHostel.facilities.slice(0, 4).map((facility, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                          >
                            {facility}
                          </span>
                        ))}
                        {selectedHostel.facilities.length > 4 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            +{selectedHostel.facilities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirm Button */}
              <motion.button
                onClick={handleConfirm}
                disabled={loading || !profileStatus.isComplete}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg ${
                  loading || !profileStatus.isComplete
                    ? 'bg-gray-300 cursor-not-allowed text-gray-500 shadow-none'
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 hover:shadow-xl transform hover:scale-[1.02]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                    Creating Booking...
                  </span>
                ) : profileStatus.isComplete ? (
                  "Confirm & Create Booking"
                ) : (
                  "Complete Profile to Continue"
                )}
              </motion.button>

              {/* Info Note */}
              <p className="text-xs text-center text-gray-500 pt-2">
                By confirming, you agree to our booking terms and conditions
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function ExtraBookingDetails() {
  return (
    <Suspense fallback={
      <div className="px-3 md:px-8 flex justify-center py-10">
        <SkeletonCard />
      </div>
    }>
      <ExtraBookingDetailsContent />
    </Suspense>
  );
}
