"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "./SubmitButton";
import FormField from "@/app/(auth)/forms/FormField";
import { ExtraDetailsFormValues, extraDetailsSchema } from "../schemas/booking";
import { motion, AnimatePresence } from "framer-motion";

interface ExtraDetailsFormProps {
  onSubmit: (data: ExtraDetailsFormValues) => void;
  defaultValues?: Partial<ExtraDetailsFormValues>;
  loading?: boolean;
}

export default function ExtraDetailsForm({
  onSubmit,
  defaultValues,
  loading = false,
}: ExtraDetailsFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExtraDetailsFormValues>({
    resolver: zodResolver(extraDetailsSchema),
    defaultValues: {
      hostelName: "",
      roomTitle: "",
      price: "",
      currency: "GHC",
      emergencyContactName: "",
      emergencyContactNumber: "",
      relation: "",
      hasMedicalCondition: false,
      medicalCondition: "",
      ...defaultValues,
    },
  });

  const hasMedicalCondition = watch("hasMedicalCondition");

  const submitHandler: SubmitHandler<ExtraDetailsFormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <motion.form
      onSubmit={handleSubmit(submitHandler)}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col gap-5 mt-8 pb-10 w-full"
    >
      <FormField
        label="Emergency Contact Name"
        name="emergencyContactName"
        register={register}
        error={errors.emergencyContactName}
        placeholder="Enter full name"
        required
      />

      <FormField
        label="Emergency Contact Number"
        name="emergencyContactNumber"
        register={register}
        error={errors.emergencyContactNumber}
        placeholder="Enter phone number"
        required
      />

      <FormField
        label="Relation to Student"
        name="relation"
        register={register}
        error={errors.relation}
        placeholder="e.g. Father, Sister"
        required
      />

      <FormField
        label="I have a medical condition or disability"
        name="hasMedicalCondition"
        register={register}
        error={errors.hasMedicalCondition}
      >
        <input
          type="checkbox"
          {...register("hasMedicalCondition")}
          className="w-5 h-5 accent-yellow-400 cursor-pointer"
        />
      </FormField>

      <AnimatePresence>
        {hasMedicalCondition && (
          <motion.div
            key="medical"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <FormField
              label="Please specify your condition or disability"
              name="medicalCondition"
              register={register}
              error={errors.medicalCondition}
              required
            >
              <textarea
                {...register("medicalCondition", { required: hasMedicalCondition })}
                rows={3}
                placeholder="e.g. Asthma, Hearing impairment, Mobility challenge..."
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-1 focus:ring-yellow-400 outline-none resize-none"
              />
            </FormField>
          </motion.div>
        )}
      </AnimatePresence>

      <SubmitButton loading={loading} />
    </motion.form>
  );
}
