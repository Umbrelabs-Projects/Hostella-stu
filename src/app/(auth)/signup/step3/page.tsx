"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { Step2Data, step2Schema } from "@/app/(auth)/validations/signUpSchema";
import FormField from "../../forms/FormField";
import PdfUploadField from "./components/PdfUploadField";

interface DetailsFormProps {
  onPrev?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function DetailsForm({ onPrev }: DetailsFormProps) {
  const { signUp, signupData, clearSignupProgress, loading } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      firstName: signupData.firstName ?? "",
      lastName: signupData.lastName ?? "",
      gender: signupData.gender ?? undefined,
      level: signupData.level ?? undefined,
      school: signupData.school ?? "",
      studentId: signupData.studentId ?? "",
      phone: signupData.phone ?? "",
      admissionLetter: signupData.admissionLetter ?? null,
    },
  });

  const onSubmit = async (data: Step2Data) => {
    try {
      if (
        !signupData.email ||
        !signupData.password ||
        !signupData.confirmPassword
      ) {
        toast.error("Step 1 data is missing.");
        return;
      }

      const fullData = {
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
        ...data,
      };

      await signUp(fullData);
      toast.success("Signup successful!");

      clearSignupProgress();
      router.push("/dashboard");
    } catch {
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl pt-12 mb-6 md:mb-0 md:pt-0 px-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
        Student Info
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* First Name & Last Name */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="firstName"
            placeholder="Elvis"
            register={register}
            error={errors.firstName}
          />
          <FormField
            label="Last Name"
            name="lastName"
            placeholder="Owusu Gyasi"
            register={register}
            error={errors.lastName}
          />
        </div>

        {/* Gender & Level */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Gender"
            name="gender"
            register={register}
            error={errors.gender}
          >
            <select
              {...register("gender")}
              className={`mt-1 w-full p-2.5 border rounded-lg ${
                errors.gender ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value={undefined}>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </FormField>

          <FormField
            label="Level"
            name="level"
            register={register}
            error={errors.level}
          >
            <select
              {...register("level")}
              className={`mt-1 w-full p-2.5 border rounded-lg ${
                errors.level ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value={undefined}>Select level</option>
              <option value="100">Level 100</option>
              <option value="200">Level 200</option>
              <option value="300">Level 300</option>
              <option value="400">Level 400</option>
            </select>
          </FormField>
        </div>

        {/* Student ID & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Student ID"
            name="studentId"
            placeholder="20724143"
            register={register}
            error={errors.studentId}
          />
          <FormField
            label="Phone"
            name="phone"
            placeholder="0552778478"
            register={register}
            error={errors.phone}
          />
        </div>

        {/* School */}
        <FormField
          label="School"
          name="school"
          register={register}
          error={errors.school}
        >
          <select
            {...register("school")}
            className={`mt-1 w-full p-2.5 border rounded-lg ${
              errors.school ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select University</option>
            <option value="KNUST">KNUST</option>
            <option value="KsTU">KsTU</option>
          </select>
        </FormField>
        {/* Admission Letter */}
        <PdfUploadField
          name="admissionLetter"
          register={register}
          setValue={setValue}
          label="Upload Admission letter"
          error={errors.admissionLetter}
        />

        {/* Buttons */}
        <div className="">
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg disabled:opacity-70"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
