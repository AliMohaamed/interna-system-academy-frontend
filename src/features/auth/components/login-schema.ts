import { z } from "zod";

// Define the shape of the form ensuring types match
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Infer TypeScript type directly from Zod Schema (No manual typing)
export type LoginFormData = z.infer<typeof loginSchema>;