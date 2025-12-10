import { z } from "zod";

export const extraDetailsSchema = z
  .object({
    bookingId: z.string().optional(),
    hostelName: z.string().min(1),
    roomTitle: z.string().min(1),
    price: z.string().min(1),
    currency: z.string().min(1, "Currency is required"),
    emergencyContactName: z.string().min(1, "This field is required"),
    emergencyContactNumber: z
      .string()
      .min(1, "This field is required")
      .regex(/^\+?\d{7,15}$/, "Enter a valid phone number"),
    relation: z.string().min(1, "This field is required"),
    hasMedicalCondition: z.boolean(),
    medicalCondition: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.hasMedicalCondition ||
      (data.medicalCondition && data.medicalCondition.trim().length > 0),
    {
      message: "Please specify your condition or disability",
      path: ["medicalCondition"],
    }
  );

export type ExtraDetailsFormValues = z.infer<typeof extraDetailsSchema>;
