"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import FormField from "../../forms/FormField";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
    const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordForm>();

  const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast("Passwords do not match!");
      return;
    }

    try {
      console.log("Resetting password...");
      // await axios.post("/api/auth/reset-password", data);
      toast("Password reset successful!");
 // ✅ Redirect to login page
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast("Failed to reset password.");
    }
  };

  return (
    <div className="flex mt-12 md:mt-0 items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white rounded-lg shadow p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500 text-center">
          Create a new password for your account.
        </p>

        <FormField
          label="New Password"
          name="password"
          type="password"
          register={register}
          error={errors.password}
          placeholder="••••••••"
          required
        />

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          register={register}
          error={errors.confirmPassword}
          placeholder="••••••••"
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg font-semibold"
        >
          {isSubmitting ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
