import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  gender: z.enum(["male", "female"], { message: "Gender is required" }),
  level: z.enum(["100", "200", "300", "400"], { message: "Level is required" }),
  school: z.string().min(2, "School is required"),
  studentId: z.string().min(3, "Student ID is required"),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Enter a valid phone number")
    .min(10),
});

export type SignupFormData = z.infer<typeof signupSchema>;
