"use client";

import { useParams, useRouter } from "next/navigation";
import { hostelsData, roomsData } from "@/lib/constants";
import ExtraDetailsForm from "../components/ExtraDetailsForm";
import Image from "next/image";
import { ExtraDetailsFormValues } from "../schemas/booking";
import BookingDetails from "../components/BookingDetails";
import { useAuthStore } from "@/store/useAuthStore";
import { motion } from "framer-motion";

export default function ExtraBookingDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { extraBookingDetails, updateExtraBookingDetails } = useAuthStore();

  const room = roomsData.find((r) => r.id === Number(id));
  const hostel = hostelsData.find((h) => h.id === room?.id); 

  if (!room || !hostel) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Room or Hostel not found
      </p>
    );
  }

  const bookingDetails = {
    hostelName: hostel.name,
    roomTitle: room.title,
    price: room.price,
    bookingId: extraBookingDetails.bookingId,
  };

  const handleSubmit = (data: ExtraDetailsFormValues) => {
    const fullData = { ...data, ...bookingDetails };
    updateExtraBookingDetails(fullData);
    window.scrollTo(0, 0);
    router.push(`/dashboard/booking/success/${room.id}`);
  };

  return (
    <section className="bg-[#FFF8E1] px-3 md:px-8 flex justify-center py-10">
      <motion.div
        className="bg-white w-full max-w-5xl rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Image Section */}
        <div className="relative w-full h-64 md:h-auto md:w-1/2">
          <Image
            src={room.image}
            alt={room.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 pt-6 px-6">
          <BookingDetails
            hostelName={bookingDetails.hostelName}
            roomTitle={bookingDetails.roomTitle}
            price={bookingDetails.price}
            bookingId={bookingDetails.bookingId}
          />

          <ExtraDetailsForm
            onSubmit={handleSubmit}
            defaultValues={bookingDetails}
          />
        </div>
      </motion.div>
    </section>
  );
}
