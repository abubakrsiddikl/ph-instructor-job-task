import { z } from "zod";

const webUrl = z.url({
	protocol: /^https?$/,
	message: "Must be a valid HTTP or HTTPS URL",
});

export const createProjectSchema = z.object({
	name: z.string().trim().min(2).max(120),
	repositoryUrl: webUrl,
	liveUrl: webUrl.optional().or(z.literal("")),
	description: z.string().trim().min(2).max(5000),
});

export const updateProjectStatusSchema = z.object({
	status: z.enum(["APPROVED", "REJECTED"]),
});

export const projectQuerySchema = z.object({
	page: z.coerce.number().int().positive().optional(),
	limit: z.coerce.number().int().positive().max(100).optional(),
	sortBy: z.enum(["name", "createdAt", "updatedAt", "status"]).optional(),
	sortOrder: z.enum(["asc", "desc"]).optional(),
	status: z.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
});
