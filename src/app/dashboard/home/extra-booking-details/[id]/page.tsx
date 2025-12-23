"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import BookingDetails from "../components/BookingDetails";
import { useAuthStore } from "@/store/useAuthStore";
import { useHostelStore } from "@/store/useHostelStore";
import { useBookingStore } from "@/store/useBookingStore";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { AlertCircle } from "lucide-react";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error";
import PaymentMethodSelector from "@/app/dashboard/booking/success/components/PaymentMethodSelector";

type RoomType = 'SINGLE' | 'DOUBLE';

export default function ExtraBookingDetails() {
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
    rt => (roomTypeParam === 'SINGLE' && (rt.type === 'One-in-one' || rt.title === 'One-in-one')) ||
          (roomTypeParam === 'DOUBLE' && (rt.type === 'Two-in-one' || rt.title === 'Two-in-one'))
  );

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
    if (!selectedHostel || !hostelId) {
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

      // Create booking using the API
      const booking = await createBooking({
        hostelId,
        preferredRoomType: roomTypeParam,
      });

      if (booking) {
        toast.success("Booking created successfully!");
        window.scrollTo(0, 0);
        router.push(`/dashboard/booking/success/${booking.id}`);
      } else {
        toast.error("Failed to create booking");
      }
    } catch (error: unknown) {
      console.error("Booking creation failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  if (hostelLoading) {
    return (
      <div className="px-3 md:px-8 flex justify-center py-10">
        <SkeletonCard />
      </div>
    );
  }

  if (hostelError || !selectedHostel) {
    return (
      <div className="px-3 md:px-8 flex justify-center py-10">
        <ErrorState
          message={hostelError || "Hostel not found"}
          onRetry={() => hostelId && fetchHostelById(hostelId)}
        />
      </div>
    );
  }

  return (
    <section className="px-3 md:px-8 flex flex-col items-center py-10">
      {/* Main Booking Form Card */}
      <motion.div
        className="bg-white w-full max-w-5xl rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row mb-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Image Section */}
        <div className="relative w-full h-64 md:h-auto md:w-1/2">
          {selectedHostel.image ? (
            <Image
              src={selectedHostel.image}
              alt={selectedHostel.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Booking Details Section */}
        <div className="w-full md:w-1/2 pt-6 px-6 pb-6">
          <BookingDetails
            hostelName={bookingDetails.hostelName}
            roomTitle={bookingDetails.roomTitle}
            price={bookingDetails.price}
            bookingId={bookingDetails.bookingId}
          />

          {/* Profile Incomplete Warning */}
          {!profileStatus.isComplete && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-red-800">Profile Incomplete</p>
                  <p className="text-sm text-red-700 mt-1">
                    Please complete the following fields before booking: {profileStatus.missingFields.join(", ")}
                  </p>
                  <button
                    onClick={() => router.push("/dashboard/settings?incomplete=true")}
                    className="mt-2 text-sm text-red-600 hover:text-red-700 underline font-medium"
                  >
                    Complete Profile Now →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Profile Summary (Read-only) */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-4"
            >
              <h3 className="text-lg font-semibold text-gray-800">Profile Information</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <p><span className="text-gray-600">Name:</span> {user.firstName} {user.lastName}</p>
                  <p><span className="text-gray-600">Email:</span> {user.email}</p>
                  <p><span className="text-gray-600">Campus:</span> {user.campus || 'N/A'}</p>
                  <p><span className="text-gray-600">Programme:</span> {user.programme || 'N/A'}</p>
                  <p><span className="text-gray-600">Level:</span> {user.level || 'N/A'}</p>
                  <p><span className="text-gray-600">Student ID:</span> {user.studentRefNumber || 'N/A'}</p>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <p className="font-medium text-gray-700 mb-1">Emergency Contact</p>
                  <p><span className="text-gray-600">Name:</span> {user.emergencyContactName || 'N/A'}</p>
                  <p><span className="text-gray-600">Phone:</span> {user.emergencyContactPhone || 'N/A'}</p>
                  <p><span className="text-gray-600">Relation:</span> {user.emergencyContactRelation || 'N/A'}</p>
                </div>
                {(user.hasHealthCondition || user.bloodType || user.allergies) && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="font-medium text-gray-700 mb-1">Health Information</p>
                    {user.hasHealthCondition && (
                      <p><span className="text-gray-600">Condition:</span> {user.healthCondition || 'Not specified'}</p>
                    )}
                    {user.bloodType && (
                      <p><span className="text-gray-600">Blood Type:</span> {user.bloodType}</p>
                    )}
                    {user.allergies && (
                      <p><span className="text-gray-600">Allergies:</span> {user.allergies}</p>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                To update your profile information, visit{" "}
                <button
                  onClick={() => router.push("/dashboard/settings")}
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Settings
                </button>
              </p>
            </motion.div>
          )}

          {/* Confirm Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <button
              onClick={handleConfirm}
              disabled={loading || !profileStatus.isComplete}
              className={`w-full cursor-pointer font-semibold py-3 rounded-xl transition-colors shadow-sm ${
                loading || !profileStatus.isComplete
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                  : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
              }`}
            >
              {loading ? "Creating Booking..." : profileStatus.isComplete ? "Confirm Booking Details" : "Complete Profile to Continue"}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Payment Options Section - Below the form */}
      <PaymentMethodSelector />
    </section>
  );
}
