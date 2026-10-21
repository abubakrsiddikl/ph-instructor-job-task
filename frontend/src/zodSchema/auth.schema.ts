import { z } from "zod";

export const registerZodSchema = z.object({
  name: z
    .string({ message: "Name is required" })
    .min(2, "Name must be at least 2 characters"),
  email: z.email({ message: "Invalid email" }),

  passwordHash: z
    .string({ message: "Password is required" })
    .min(4, "Password must be at least 4 characters"),
});

export const loginZodSchema = z.object({
  email: z.email({ message: "Invalid email" }),
  passwordHash: z
    .string({ message: "Password is required" })
    .min(4, "Password must be at least 4 characters"),
});
