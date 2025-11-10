"use client";

import { useParams, useRouter } from "next/navigation";
import { hostelsData, roomsData } from "@/lib/constants";
import ExtraDetailsForm from "../components/ExtraDetailsForm";
import Image from "next/image";
import { images } from "@/lib/images";
import { ExtraDetailsFormValues } from "../schemas/booking";
import BookingDetails from "../components/BookingDetails";

export default function ExtraBookingDetails() {
  const { id } = useParams(); // room ID
  const router = useRouter();

  const room = roomsData.find((r) => r.id === Number(id));
  const hostel = hostelsData.find((h) => h.id === room?.id);

  if (!room || !hostel) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Room or Hostel not found
      </p>
    );
  }

  const handleSubmit = (data: ExtraDetailsFormValues) => {
    console.log("Form Submitted:", data);

    alert(
      `Proceeding to payment for ${data.roomTitle} at ${data.hostelName}\nEmergency Contact: ${data.emergencyContactName}`
    );

    router.push("/dashboard/home/payment");
  };

  return (
    <section className="bg-[#FFF8E1]  px-2 md:px-8 flex justify-center">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="relative w-full h-64  md:h-auto md:w-1/2">
          <Image
            src={room.image || images.room2}
            alt={room.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 pt-6 px-6">
          {/* Booking Details */}
          <BookingDetails
            hostelName={hostel.name}
            roomTitle={room.title}
            price={room.price}
          />

          {/* Extra Details Form */}
          <ExtraDetailsForm
            onSubmit={handleSubmit}
            defaultValues={{
              hostelName: hostel.name,
              roomTitle: room.title,
              price: room.price,
            }}
          />
        </div>
      </div>
    </section>
  );
}
