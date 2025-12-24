import { images } from "@/lib/images";
import Image from "next/image";
import { motion } from "framer-motion";

export default function BookingSuccessCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full md:w-1/2 bg-white rounded-xl overflow-hidden shadow-sm"
    >
      <div className="relative h-72 md:h-[30rem]">
        <Image
          src={images.bookingSuccessful}
          alt="Booking success"
          fill
          className="object-cover"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-6"
        >
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-2xl md:text-3xl font-bold text-yellow-400"
          >
            Complete Your Payment
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="text-white mt-3 md:mt-6 text-sm"
          >
            Choose your preferred payment method below to complete your booking.
            Your room will be secured once payment is confirmed.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
}
