"use client";

import React, { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  mainSignupSchema,
  MainSignupData,
} from "../../validations/mainSignupSchema";
import FormField from "../../forms/FormField";
import Link from "next/link";

export default function MainSignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MainSignupData>({
    resolver: zodResolver(mainSignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: MainSignupData) => {
    console.log("Main signup:", data);
    window.location.href = "/signup/verify";
  };

  return (
    <div className="flex items-center justify-center mt-12 md:mt-0">
      <div className="w-full flex flex-col justify-between">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Create an Account</h2>
          <p className="text-gray-500 text-sm mt-2">
            Sign up to continue to{" "}
            <span className="text-yellow-500 font-medium">Hostella</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex-1 mt-6">
          {/* Email Field */}
          <FormField
            label="Email"
            name="email"
            register={register}
            error={errors.email}
            placeholder="Enter your email"
            type="email"
          />

          {/* Password Field */}
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
                className={`w-full border rounded-lg p-3 pr-10 text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none transition ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

          {/* Confirm Password Field */}
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
                className={`w-full border rounded-lg p-3 pr-10 text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none transition ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowRePassword(!showRePassword)}
                className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
              >
                {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>

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
          
            <span className="text-gray-700 font-medium">Sign Up with Google</span>
          </Button>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200"
          >
            Continue
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 pt-3 border-t ">
          Already have an account?{" "}
          <Link
            href="/login"
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium transition"
          >
            <LogIn className="w-4 h-4 mr-1" />
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
