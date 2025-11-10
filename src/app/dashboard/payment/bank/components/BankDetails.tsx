"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import PdfUploadField from "@/app/(auth)/signup/step3/components/PdfUploadField";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

// ✅ Define Zod Schema
const paymentSchema = z.object({
  receipt: z
    .any()
    .refine((files) => files && files.length > 0, "Receipt upload is required.")
    .refine(
      (files) => files?.[0]?.type === "application/pdf",
      "Only PDF files are allowed."
    ),
});

// ✅ Infer TypeScript type
type PaymentForm = z.infer<typeof paymentSchema>;

export default function BankDetails() {
  const {extraBookingDetails} = useAuthStore();
  const router = useRouter();
  const BankDetails = [
    { title: "Amount", value: extraBookingDetails.price },
    { title: "Bank Name", value: "Cal Bank" },
    { title: "Account Name", value: "Hostella" },
    { title: "Account Number", value: "000000" },
  ];
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  });

  const onSubmit = (data: PaymentForm) => {
    console.log("Receipt uploaded:", data.receipt?.[0]);
    router.push("/dashboard/payment/paymentCompleted");
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      {/* Payment Note */}
      <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">
        <p className="text-sm text-gray-700 leading-relaxed">
          Please make sure you make payment to the account below, for Hostella
          wouldn’t be responsible for any wrong transaction on your part.
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Booking Details
        </h3>
        <div className="space-y-3 text-sm text-gray-700">
          {BankDetails.map((detail) => (
            <div className="flex justify-between" key={detail.title}>
              <span className="font-medium">{detail.title}:</span>
              <span>{detail.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upload Receipt */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
      >
        <PdfUploadField
          name="receipt"
          register={register}
          setValue={setValue}
          label="Upload Payment Receipt"
          error={errors.receipt}
        />
        <Button
          type="submit"
          className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Receipt"}
        </Button>
      </form>
    </div>
  );
}
