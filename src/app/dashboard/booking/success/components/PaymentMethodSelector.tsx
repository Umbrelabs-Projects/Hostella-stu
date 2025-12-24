"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Smartphone, Check } from "lucide-react";
import { motion } from "framer-motion";

const paymentOptions = [
  { id: "bank", label: "Bank Pay", icon: Banknote },
  { id: "momo", label: "MoMo Pay", icon: Smartphone },
];

export default function PaymentMethodSelector() {
  const [selected, setSelected] = useState("bank");
  const router = useRouter();

  const handleProceed = () => {
    router.push(`/dashboard/payment/${selected}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-3xl mt-12 flex flex-col items-center"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg font-semibold mb-6"
      >
        Choose a Payment Method
      </motion.h2>

      <div className="flex flex-col sm:flex-row gap-4">
        {paymentOptions.map(({ id, label, icon: Icon }) => {
          const isSelected = selected === id;
          return (
            <motion.div
              key={id}
              onClick={() => setSelected(id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`cursor-pointer flex items-center gap-3 border rounded-xl px-6 py-4 w-60 transition ${
                isSelected
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-300"
              }`}
            >
              <Icon />
              <span className="font-medium">{label}</span>
              <div
                className={`ml-auto w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center ${
                  isSelected ? "bg-yellow-500" : "bg-white"
                }`}
              >
                {isSelected && <Check size={12} className="text-white" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 w-full flex justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProceed}
          className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg w-60 transition"
        >
          Proceed to Pay
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
