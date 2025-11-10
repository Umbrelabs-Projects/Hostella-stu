"use client";

interface SubmitButtonProps {
  label?: string;
}

export default function SubmitButton({ label = "Proceed to Make Payment" }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-xl transition-colors mt-4"
    >
      {label}
    </button>
  );
}
