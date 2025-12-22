import { z } from "zod";

export const step1Schema = z
  .object({
    email: z.string().email("Enter a valid email").min(1, "Email is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const step2Schema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),

  // ✅ New Zod v4 style (use refine for required message)
  gender: z
    .enum(["male", "female"])
    .refine((val) => !!val, "Gender is required"),

  level: z
    .enum(["100", "200", "300", "400"])
    .refine((val) => !!val, "Level is required"),

  school: z.string().min(2, "School is required"),
  studentId: z.string().min(3, "Student ID is required"),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Enter a valid phone number")
    .min(10, "Enter a valid phone number"),

  admissionLetter: z
    .any()
    .nullable()
    .optional()
    .superRefine((files, ctx) => {
      // Only validate if file is provided (it's optional)
      if (files && files.length > 0) {
        const file = files[0];
        const allowedTypes = [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        if (!allowedTypes.includes(file.type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "File must be jpeg, jpg, png, gif, webp, pdf, doc, or docx",
          });
        } else if (file.size > 5 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "File must be less than 5MB",
          });
        }
      }
    }),
});

export const fullSignUpSchema = step1Schema.merge(step2Schema);

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type FullSignUpData = z.infer<typeof fullSignUpSchema>;
