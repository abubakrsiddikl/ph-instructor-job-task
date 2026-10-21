import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string({ message: "Name is required" }).trim().min(1),
  email: z.email({ message: "Invalid email address" }),
  passwordHash: z.string({ message: "Password is required" }).min(4),
});
