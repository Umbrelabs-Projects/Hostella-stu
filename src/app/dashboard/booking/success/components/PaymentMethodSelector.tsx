"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, Smartphone } from "lucide-react";

const paymentOptions = [
  { id: "bank", label: "Bank Pay", icon: Banknote },
  { id: "momo", label: "MoMo Pay", icon: Smartphone },
];

export default function PaymentMethodSelector() {
  const [selected, setSelected] = useState("bank");
  const router = useRouter();

  const handleProceed = () => {
    if (selected === "momo") {
      router.push("/dashboard/payment/momo");
    } else {
      router.push("/dashboard/payment/bank");
    }
  };

  return (
    <div className="w-full max-w-3xl mt-12 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-6">Choose a Payment Method</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        {paymentOptions.map(({ id, label, icon: Icon }) => {
          const isSelected = selected === id;
          return (
            <div
              key={id}
              onClick={() => setSelected(id)}
              className={`cursor-pointer flex items-center gap-3 border rounded-xl px-6 py-4 w-60 transition ${
                isSelected
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-300"
              }`}
            >
              <Icon />
              <span className="font-medium">{label}</span>
              <div
                className={`ml-auto w-5 h-5 border border-gray-300 rounded-full flex items-center justify-center text-white text-xs ${
                  isSelected ? "bg-yellow-500" : "bg-white"
                }`}
              >
                {isSelected && "✓"}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 w-full flex justify-center">
        <button
          onClick={handleProceed}
          className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-lg w-60 transition"
        >
          Proceed to Pay
        </button>
      </div>
    </div>
  );
}
