"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  signupSchema,
  SignupFormData,
} from "../../../validations/signupSchema";
import FormField from "../../../forms/FormField";
import PdfUploadField from "./PdfUploadField";

export default function DetailsForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "",
      level: "",
      school: "",
      studentId: "",
      phone: "",
      admissionLetter: null,
      email: undefined,
      password: undefined,
      confirmPassword: undefined,
    },
  });

  // ✅ type-safe error type
  const onError = (errors: FieldErrors<SignupFormData>) => {
    console.error("❌ Validation errors:", errors);
  };

  const onSubmit = (data: SignupFormData) => {
    console.log("✅ Form submitted:", data);
    const file = data.admissionLetter?.[0];
    if (file) {
      console.log("Uploaded file:", file.name, file.size);
    }

    // Navigate to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl pt-12 mb-6 md:mb-0 md:pt-0 px-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
        Student Info
      </h2>

      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="First Name"
            name="firstName"
            register={register}
            error={errors.firstName}
            placeholder="Enter first name"
          />
          <FormField
            label="Last Name"
            name="lastName"
            register={register}
            error={errors.lastName}
            placeholder="Enter last name"
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
              className={`mt-1 w-full p-2.5 border rounded-lg text-gray-700 focus:ring-1 focus:ring-yellow-400 outline-none ${
                errors.gender ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select gender</option>
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
              className={`mt-1 w-full p-2.5 border rounded-lg text-gray-700 focus:ring-2 focus:ring-yellow-400 outline-none ${
                errors.level ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select level</option>
              <option value="100">Level 100</option>
              <option value="200">Level 200</option>
              <option value="300">Level 300</option>
              <option value="400">Level 400</option>
            </select>
          </FormField>
        </div>

        {/* Student ID & Phone */}
        <div className="flex justify-between gap-3 flex-col md:flex-row w-full">
          <FormField
            label="Student ID"
            name="studentId"
            register={register}
            error={errors.studentId}
            placeholder="Enter your student ID"
          />
          <FormField
            label="Phone Number"
            name="phone"
            register={register}
            error={errors.phone}
            placeholder="Enter your phone number"
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
            className={`mt-1 w-full p-2.5 border rounded-lg text-gray-700 focus:ring-1 focus:ring-yellow-400 outline-none ${
              errors.school ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select University</option>
            <option value="KNUST">
              Kwame Nkrumah University of Science and Technology
            </option>
            <option value="KsTU">Kumasi Technical University</option>
          </select>
        </FormField>

        <PdfUploadField
          name="admissionLetter"
          register={register}
          setValue={setValue}
          error={errors.admissionLetter}
        />

        <Button
          type="submit"
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2.5 rounded-lg shadow-md transition-all duration-200"
        >
          Continue
        </Button>
      </form>
    </div>
  );
}
