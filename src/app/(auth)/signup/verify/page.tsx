"use client";

import { useState, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";

const verificationSchema = z.object({
  otp: z
    .array(z.string().regex(/^[0-9]$/, "Only numbers allowed"))
    .length(5, "Enter all 5 digits"),
});

type VerificationData = z.infer<typeof verificationSchema>;

export default function VerificationPage() {
  const [isVerified, setIsVerified] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { otp: ["", "", "", "", ""] },
  });

  const otp = watch("otp");

  const handleChange = (value: string, index: number) => {
    if (/^[0-9]?$/.test(value)) {
      const updatedOtp = [...otp];
      updatedOtp[index] = value;
      setValue("otp", updatedOtp);
    }
  };

  const onSubmit = (data: VerificationData) => {
    console.log("Verifying:", data);
    setIsVerified(true);
    setTimeout(() => (window.location.href = "/signup/details"), 2000);
  };

  return (
    <div className="flex justify-center items-center bg-gray-50 mt-[12rem] md:mt-0">
      {!isVerified ? (
        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verification</h2>
          <p className="text-gray-500 mb-6 text-sm">
            Enter the OTP code sent to <strong>johndoe@gmail.com</strong>
          </p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center gap-3 mb-4">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  inputMode="numeric"
                  value={digit}
                  maxLength={1}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleChange(e.target.value, i)
                  }
                  className={`w-12 h-12 border rounded-lg text-center text-lg focus:ring-2 focus:ring-yellow-400 outline-none ${
                    errors.otp ? "border-red-500" : "border-gray-300"
                  }`}
                />
              ))}
            </div>
            {errors.otp && (
              <p className="text-red-500 text-sm mb-4">{errors.otp.message}</p>
            )}

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
          <p className="text-gray-500 text-sm">
            Redirecting to your setup page...
          </p>
        </div>
      )}
    </div>
  );
}
