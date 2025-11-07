"use client";

import React, { useState } from "react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FormField from "../forms/FormField";
import { useAuthStore } from "@/store/useAuthStore";

// ✅ Validation schema
const signInSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ✅ Type for form data
type SignInData = z.infer<typeof signInSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Zustand store
  const { signIn, loading } = useAuthStore();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Handle login
  const onSubmit = async (data: SignInData) => {
    try {
      await signIn(data);
      toast.success("Welcome back");
      router.push("/dashboard");
    } catch {
      toast.error("Failed to sign in. Please try again.");
    }
  };

  return (
    <div className="flex items-center mt-12 md:mt-0 justify-center mb-4 md:mb-0">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-2">
            Sign in to your{" "}
            <span className="text-yellow-500 font-medium">Hostella</span>{" "}
            account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
          {/* Email */}
          <FormField<SignInData>
            label="Email"
            name="email"
            register={register}
            error={errors.email}
            placeholder="Enter your email"
            type="email"
          />

          {/* Password */}
          <FormField<SignInData>
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
                className={`w-full border rounded-lg p-2 pr-10 text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none transition ${
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

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-400"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow-md transition duration-200 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

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
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600 pt-3 border-t mt-6">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="inline-flex items-center text-yellow-600 hover:text-yellow-700 font-medium transition"
          >
            <UserPlus className="w-4 h-4 mr-1" />
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
