"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation"; // ✅ for navigation in Next.js
import FormField from "../forms/FormField";

interface VerifyCodeForm {
  code: string;
}

export default function VerifyCodePage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<VerifyCodeForm>();

  const onSubmit: SubmitHandler<VerifyCodeForm> = async (data) => {
    try {
      console.log("Verifying code:", data.code);
      // await axios.post("/api/auth/verify-code", data);

      alert("Code verified successfully!");

      // ✅ Redirect to reset password page
      router.push("/reset-password");
    } catch (error) {
      console.error(error);
      alert("Invalid code, please try again.");
    }
  };

  return (
    <div className="flex mt-14 md:mt-0 items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-lg shadow p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Verify Reset Code
        </h1>
        <p className="text-sm text-gray-500 text-center">
          Enter the verification code sent to your email.
        </p>

        <FormField
          label="Verification Code"
          name="code"
          type="text"
          register={register}
          error={errors.code}
          placeholder="123456"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold"
        >
          {isSubmitting ? "Verifying..." : "Verify Code"}
        </button>
      </form>
    </div>
  );
}
