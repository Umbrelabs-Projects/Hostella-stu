"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  mainSignupSchema,
  MainSignupData,
} from "../../validations/mainSignupSchema";
import FormField from "../../forms/FormField";

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
    <div className="flex flex-col justify-center items-center ">
      <h2 className="text-3xl font-bold py-6 pt-18 md:pt-0 text-gray-800 text-center mb-2">
        Create an Account
      </h2>
      <div className="bg-white p-8 w-[25rem] mx-2 space-y-6">
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                className={`w-full border rounded-lg p-3 focus:ring-1 focus:ring-yellow-400 outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
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
                className={`w-full border rounded-lg p-3 focus:ring-1 focus:ring-yellow-400 outline-none ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              <button
                type="button"
                className="absolute right-3 top-3 text-gray-500"
                onClick={() => setShowRePassword(!showRePassword)}
              >
                {showRePassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </FormField>
          {/* Social Buttons */}

          <Button
            type="button"
            className="flex items-center border rounded-md px-4 py-4 h-12 w-full shadow-sm hover:bg-gray-900 cursor-pointer"
          >
            Sign Up with Google
          </Button>

          <button
            type="submit"
            className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-lg hover:bg-yellow-600 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
