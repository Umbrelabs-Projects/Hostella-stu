import { images } from "@/lib/images";
import Image from "next/image";

export default function BookingSuccessCard() {
  return (
    <div className="w-full md:w-1/2 bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="relative h-72 md:h-[30rem]">
        <Image
          src={images.bookingSuccessful}
          alt="Booking success"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-6">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
            Booking Confirmed Successfully!
          </h1>
          <p className="text-white mt-3 md:mt-6 text-sm">
            Thank you for choosing Hostella! Your reservation is confirmed.
            Make payment within 24 hours to secure your room.
          </p>
        </div>
      </div>
    </div>
  );
}
