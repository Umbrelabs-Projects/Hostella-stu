import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    gender: z
      .enum(["male", "female"])
      .optional()
      .or(z.literal(""))
      .refine((val) => val !== "", { message: "Gender is required" }),
    level: z
      .enum(["100", "200", "300", "400"])
      .optional()
      .or(z.literal(""))
      .refine((val) => val !== "", { message: "Level is required" }),
    school: z.string().min(2, "School is required"),
    studentId: z.string().min(3, "Student ID is required"),
    phone: z
      .string()
      .regex(/^[0-9]{10,15}$/, "Enter a valid phone number"),
    email: z.string().nonempty("Email is required").email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z
      .string()
      .min(6, "Confirm your password")
      .refine((val) => val.length > 0, { message: "Please confirm your password" }),
    admissionLetter: z
      .any()
      .refine(
        (files) => files && files.length === 1,
        "Please upload your admission letter"
      )
      .refine(
        (files) => files?.[0]?.type === "application/pdf",
        "Only PDF files are allowed"
      )
      .refine(
        (files) => files?.[0]?.size <= 5 * 1024 * 1024,
        "File size must be less than 5 MB"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignupFormData = z.infer<typeof signupSchema>;
