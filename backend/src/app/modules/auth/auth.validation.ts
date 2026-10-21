import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.email({ message: "Invalid email address" }),
  passwordHash: z.string({ message: "Password is required" }).min(4),
});
