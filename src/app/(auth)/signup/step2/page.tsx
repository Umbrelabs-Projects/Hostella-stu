"use client";

import React, { useState, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

const verificationSchema = z.object({
  otp: z
    .array(z.string().regex(/^[0-9]$/, "Only numbers allowed"))
    .length(5, "Enter all 5 digits"),
});

type VerificationData = z.infer<typeof verificationSchema>;

interface VerificationPageProps {
  email: string;
  onNext: () => void;
  maskOtp?: boolean; // optional: mask input for security
}

export default function VerificationPage({ email, onNext, maskOtp = false }: VerificationPageProps) {
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const { handleSubmit, setValue, watch, formState: { errors } } = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { otp: ["", "", "", "", ""] },
  });

  const otp = watch("otp");

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setValue("otp", updatedOtp);

      // Move focus to next input
      if (value && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{5}$/.test(pasteData)) {
      const pasteArray = pasteData.split("");
      setValue("otp", pasteArray);
      pasteArray.forEach((_, i) => {
        if (inputRefs.current[i]) inputRefs.current[i].value = maskOtp ? "" : pasteArray[i];
      });
      inputRefs.current[4].focus();
    } else {
      toast.error("Paste only 5 numeric digits.");
    }
  };

  const onSubmit = (data: VerificationData) => {
    console.log("Verifying:", data);
    setIsVerified(true);
    setTimeout(() => onNext(), 1500);
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 my-[3rem] md:mt-0">
      {!isVerified ? (
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Enter the OTP code sent to <strong>{email}</strong>
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center gap-3 mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el!;
                  }}
                  type={maskOtp ? "password" : "text"}
                  inputMode="numeric"
                  value={digit}
                  maxLength={1}
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                  onPaste={handlePaste}
                  className={`w-12 h-12 border rounded-lg text-center text-lg focus:ring-2 focus:ring-yellow-400 outline-none ${
                    errors.otp ? "border-red-500" : "border-gray-300"
                  }`}
                />
              ))}
            </div>

            {errors.otp && <p className="text-red-500 text-sm mb-4">{errors.otp.message}</p>}

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition"
            >
              Verify
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center animate-fadeIn">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Verified Successfully!
          </h2>
          <p className="text-gray-500 text-sm">Redirecting to your setup page...</p>
        </div>
      )}
    </div>
  );
}
