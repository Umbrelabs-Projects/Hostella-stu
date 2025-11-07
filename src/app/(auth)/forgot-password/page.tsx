"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import FormField from "../forms/FormField";

interface ForgotPasswordForm {
  email: string;
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordForm>();

  const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    try {
      console.log("Sending password reset email to:", data.email);
      // await axios.post("/api/auth/forgot-password", data);
      alert("Reset code sent to your email!");

      // ✅ Redirect to verify-code page
      router.push("/forgot-password/verify-code");
    } catch (error) {
      console.error(error);
      alert("Failed to send reset code.");
    }
  };

  return (
    <div className="flex mt-12 md:mt-0 items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-lg shadow p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-500 text-center">
          Enter your email to receive a password reset code.
        </p>

        <FormField
          label="Email Address"
          name="email"
          type="email"
          register={register}
          error={errors.email}
          placeholder="you@example.com"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold"
        >
          {isSubmitting ? "Sending..." : "Send Reset Code"}
        </button>
      </form>
    </div>
  );
}
