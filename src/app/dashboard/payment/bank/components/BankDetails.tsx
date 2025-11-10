"use client";

import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PdfUploadField from "@/app/(auth)/signup/step3/components/PdfUploadField";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

// Define Zod Schema
const paymentSchema = z.object({
  receipt: z
    .any()
    .refine((files) => files && files.length > 0, "Receipt upload is required.")
    .refine(
      (files) => files?.[0]?.type === "application/pdf",
      "Only PDF files are allowed."
    ),
});

// Infer TypeScript type
type PaymentForm = z.infer<typeof paymentSchema>;

export default function BankDetails() {
  const { extraBookingDetails } = useAuthStore();
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
    <motion.div
      className="flex flex-col gap-6 w-full max-w-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Payment Note */}
      <motion.div
        className="bg-white rounded-xl shadow-sm p-5 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <p className="text-sm text-gray-700 leading-relaxed">
          Please make sure you make payment to the account below, for Hostella
          wouldn’t be responsible for any wrong transaction on your part.
        </p>
      </motion.div>

      {/* Booking Details */}
      <motion.div
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.h3
          className="text-lg font-semibold mb-4 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Booking Details
        </motion.h3>

        <motion.div
          className="space-y-3 text-sm text-gray-700"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="visible"
        >
          {BankDetails.map((detail, index) => (
            <motion.div
              className="flex justify-between"
              key={detail.title}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            >
              <span className="font-medium">{detail.title}:</span>
              <span>{detail.value}</span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Upload Receipt */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <PdfUploadField
          name="receipt"
          register={register}
          setValue={setValue}
          label="Upload Payment Receipt"
          error={errors.receipt}
        />

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <Button
            type="submit"
            className="w-full mt-4 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Receipt"}
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
