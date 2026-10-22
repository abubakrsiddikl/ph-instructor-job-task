'use server';

import { revalidatePath } from "next/cache";
import { apiRequest } from "@/services/apiClient";
import { getCookie } from "@/services/auth/tokenHandlers";
import type {
	Project,
	ProjectActionState,
	ProjectListResult,
	ProjectStatistics,
	ProjectStatusFilter,
} from "@/types/project.type";
import {
	createProjectSchema,
	projectQuerySchema,
	updateProjectStatusSchema,
} from "@/zodSchema/project.schema";

type ProjectListPayload = Project[] | {
	projects?: Project[];
	data?: Project[];
	meta?: { total?: number; page?: number; limit?: number; totalPage?: number };
};

const submissionCooldownMs = 30_000;
const lastSubmissionByToken = new Map<string, number>();

function emptyList(page: number, limit: number, error?: string): ProjectListResult {
	return { projects: [], total: 0, page, limit, totalPage: 0, error };
}

export async function getMyProjects(): Promise<ProjectListResult> {
	const response = await apiRequest<ProjectListPayload>("/projects/mine", { method: "GET" });
	if (!response.success) return emptyList(1, 50, response.message);

	const payload = response.data;
	const projects = Array.isArray(payload) ? payload : payload?.projects ?? payload?.data ?? [];
	return {
		projects,
		total: projects.length,
		page: 1,
		limit: 50,
		totalPage: 1,
	};
}

export async function getMentorProjects(input: {
	page: number;
	limit: number;
	status: ProjectStatusFilter;
}): Promise<ProjectListResult> {
	const query = projectQuerySchema.safeParse(input);
	if (!query.success) return emptyList(input.page, input.limit, "Invalid project filters");

	const params = new URLSearchParams({
		page: String(query.data.page),
		limit: String(query.data.limit),
	});
	if (query.data.status !== "ALL") params.set("status", query.data.status);

	const response = await apiRequest<ProjectListPayload>(`/projects?${params.toString()}`, {
		method: "GET",
	});
	if (!response.success) return emptyList(query.data.page, query.data.limit, response.message);

	const payload = response.data;
	const projects = Array.isArray(payload) ? payload : payload?.projects ?? payload?.data ?? [];
	const meta = response.meta ?? (!Array.isArray(payload) ? payload?.meta : undefined);
	return {
		projects,
		total: meta?.total ?? projects.length,
		page: meta?.page ?? query.data.page,
		limit: meta?.limit ?? query.data.limit,
		totalPage: meta?.totalPage ?? Math.max(1, Math.ceil((meta?.total ?? projects.length) / query.data.limit)),
	};
}

export async function getProjectStatistics(): Promise<ProjectStatistics | null> {
	const response = await apiRequest<ProjectStatistics>("/projects/statistics", { method: "GET" });
	return response.success ? response.data : null;
}

export async function submitProject(
	_previousState: ProjectActionState | null,
	formData: FormData,
): Promise<ProjectActionState> {
	const validated = createProjectSchema.safeParse({
		name: formData.get("name"),
		repositoryUrl: formData.get("repositoryUrl"),
		liveUrl: formData.get("liveUrl") ?? "",
		description: formData.get("description"),
	});
	if (!validated.success) {
		return {
			success: false,
			message: "Please check the project details.",
			errors: validated.error.issues.map((issue) => ({
				field: String(issue.path[0] ?? "form"),
				message: issue.message,
			})),
		};
	}
	const token = await getCookie("accessToken");
	if (token) {
		const now = Date.now();
		const lastSubmissionAt = lastSubmissionByToken.get(token) ?? 0;
		if (now - lastSubmissionAt < submissionCooldownMs) {
			const waitSeconds = Math.ceil((submissionCooldownMs - (now - lastSubmissionAt)) / 1000);
			return { success: false, message: `Please wait ${waitSeconds} seconds before submitting again.` };
		}
		lastSubmissionByToken.set(token, now);
	}

	const response = await apiRequest<Project>("/projects", {
		method: "POST",
		body: JSON.stringify(validated.data),
	});
	if (!response.success) {
		if (token) lastSubmissionByToken.delete(token);
		return { success: false, message: response.message };
	}

	revalidatePath("/student/dashboard/add-project");
	return { success: true, message: "Project submitted for review." };
}

export async function updateProjectStatus(
	id: string,
	status: "APPROVED" | "REJECTED",
): Promise<ProjectActionState> {
	const validated = updateProjectStatusSchema.safeParse({ id, status });
	console.log("validated",validated)
	if (!validated.success) return { success: false, message: "Invalid project status update." };

	const response = await apiRequest<Project>(`/projects/${validated.data.id}/status`, {
		method: "PATCH",
		body: JSON.stringify({ status: validated.data.status }),
	});
	if (!response.success) return { success: false, message: response.message };

	revalidatePath("/mentor/dashboard/projects");
	return { success: true, message: `Project ${status.toLowerCase()}.` };
}
