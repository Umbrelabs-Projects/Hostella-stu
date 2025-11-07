"use client";

import React, { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import FormField from "../../forms/FormField";
import { Step1Data, step1Schema } from "../../validations/signUpSchema";

interface MainSignUpProps {
  onNext: () => void;
}

export default function MainSignUp({ onNext }: MainSignUpProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const { updateSignupData, signupData, loading } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      email: signupData.email ?? "",
      password: signupData.password ?? "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: Step1Data) => {
    updateSignupData(data);
    toast.info("Otp sent to your email");
    onNext();
  };

  return (
    <div className="flex items-center justify-center mt-12 md:mt-8 mb-4 md:mb-0">
      <div className="w-full flex flex-col justify-between">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">
            Create an Account
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Sign up to continue to{" "}
            <span className="text-yellow-500 font-medium">Hostella</span>
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 md:space-y-4 mt-6"
        >
          <FormField
            label="Email"
            name="email"
            register={register}
            error={errors.email}
            placeholder="Enter your email"
            type="email"
          />

          <FormField
            label="Password"
            name="password"
            register={register}
            error={errors.password}
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Enter your password"
                className={`w-full border rounded-lg p-3 py-2 pr-10 text-gray-700 focus:ring-1 focus:ring-yellow-400 outline-none transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

          <FormField
            label="Re-type Password"
            name="confirmPassword"
            register={register}
            error={errors.confirmPassword}
          >
            <div className="relative">
              <input
                type={showRePassword ? "text" : "password"}
                {...register("confirmPassword")}
                placeholder="Retype your password"
                className={`w-full border rounded-lg p-3 py-2 pr-10 text-gray-700 focus:ring-1 focus:ring-yellow-400 outline-none transition ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute right-3 top-3.5 text-gray-500"
              >
                {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow-md disabled:opacity-70"
          >
            {loading ? "Processing..." : "Continue"}
          </Button>
          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full h-px bg-gray-200"></div>
            <span className="absolute bg-white px-3 text-sm text-gray-400">
              or
            </span>
          </div>

          {/* Google Button */}
          <Button
            type="button"
            variant="outline"
            className="flex items-center justify-center gap-2 h-10 w-full rounded-lg border border-gray-300 shadow-sm hover:bg-gray-100 transition"
          >
            <span className="text-gray-700 font-medium">
              Sign In with Google
            </span>
          </Button>
          <div className="flex justify-center text-sm text-gray-600 pt-3 border-t">
            <p> Already have an account?</p>
            <Link
              href="/login"
              className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium transition"
            >
              <LogIn className="w-4 h-4 mr-1" /> Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
