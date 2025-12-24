"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Banknote, Smartphone, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useBookingStore } from "@/store/useBookingStore";
import { useAuthStore } from "@/store/useAuthStore";

const paymentOptions = [
  { id: "bank", label: "Bank Pay", icon: Banknote },
  { id: "momo", label: "MoMo Pay", icon: Smartphone },
];

export default function PaymentMethodSelector() {
  const [selected, setSelected] = useState("bank");
  const router = useRouter();
  const params = useParams();
  const bookingId = params?.id as string;
  const { selectedBooking } = useBookingStore();
  const { updateExtraBookingDetails, extraBookingDetails } = useAuthStore();

  const handleProceed = () => {
    // Get booking ID from URL params or selected booking
    const currentBookingId = bookingId || selectedBooking?.id;
    
    if (!currentBookingId) {
      console.error("Booking ID not found");
      return;
    }

    // Update extraBookingDetails with booking ID and price if not already set
    if (selectedBooking) {
      updateExtraBookingDetails({
        bookingId: currentBookingId,
        price: selectedBooking.price || extraBookingDetails.price,
      });
    }

    // Navigate to payment page with booking ID as query parameter
    router.push(`/dashboard/payment/${selected}?bookingId=${currentBookingId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold mb-6 text-gray-900"
      >
        Choose a Payment Method
      </motion.h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {paymentOptions.map(({ id, label, icon: Icon }) => {
          const isSelected = selected === id;
          return (
            <motion.div
              key={id}
              onClick={() => setSelected(id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`cursor-pointer flex items-center gap-3 border-2 rounded-xl px-6 py-4 flex-1 transition ${
                isSelected
                  ? "border-yellow-500 bg-yellow-50 shadow-md"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <Icon className={isSelected ? "text-yellow-600" : "text-gray-600"} />
              <span className={`font-medium ${isSelected ? "text-gray-900" : "text-gray-700"}`}>{label}</span>
              <div
                className={`ml-auto w-5 h-5 border-2 rounded-full flex items-center justify-center transition ${
                  isSelected 
                    ? "bg-yellow-500 border-yellow-500" 
                    : "bg-white border-gray-300"
                }`}
              >
                {isSelected && <Check size={12} className="text-white" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleProceed}
        className="w-full bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg transition shadow-md hover:shadow-lg"
      >
        Proceed to Pay
      </motion.button>
    </motion.div>
  );
}
