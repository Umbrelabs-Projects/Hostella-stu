"use client";
import { useState } from "react";
import { Banknote, Smartphone } from "lucide-react";

const paymentOptions = [
  { id: "bank", label: "Bank Pay", icon: Banknote },
  { id: "momo", label: "MoMo Pay", icon: Smartphone },
];

export default function PaymentMethodSelector() {
  const [selected, setSelected] = useState("bank");

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {paymentOptions.map(({ id, label, icon: Icon }) => {
        const isSelected = selected === id;
        return (
          <div
            key={id}
            onClick={() => setSelected(id)}
            className={`cursor-pointer flex items-center gap-3 border rounded-xl px-6 py-4 w-60 transition ${
              isSelected ? "border-yellow-500 bg-yellow-50" : "border-gray-300"
            }`}
          >
            <Icon />
            <span className="font-medium">{label}</span>
            {/* Round indicator always visible */}
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
  );
}
