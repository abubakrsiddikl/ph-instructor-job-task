import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .max(2048, "URL is too long")
  .refine((value) => value === "" || z.url().safeParse(value).success, {
    message: "Enter a valid URL",
  })
  .transform((value) => value || undefined);

export const createProjectSchema = z.object({
  name: z.string().trim().min(3, "Project name must be at least 3 characters").max(120),
  repositoryUrl: z.url("Enter a valid repository URL").max(2048),
  liveUrl: optionalUrl,
  description: z.string().trim().min(2, "Description must be at least 2 characters").max(3000),
});

export const projectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  status: z.enum(["ALL", "APPROVED", "REJECTED"]).default("ALL"),
});

export const updateProjectStatusSchema = z.object({
  id: z.string().uuid("Invalid project"),
  status: z.enum(["APPROVED", "REJECTED"]),
});

export type CreateProjectInput = z.input<typeof createProjectSchema>;