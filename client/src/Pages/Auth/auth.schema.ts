import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export const signupSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50),
  username: z.string().trim().min(3, "Username must be at least 3 characters").max(30),
  email: z.string().trim().email("Enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must include a lowercase letter")
    .regex(/[A-Z]/, "Password must include an uppercase letter")
    .regex(/[0-9]/, "Password must include a number")
    .regex(/[^A-Za-z0-9]/, "Password must include a symbol"),
  acceptTerms: z.boolean().refine((accepted) => accepted, "You must accept the terms to continue"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("Enter a valid email address"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
