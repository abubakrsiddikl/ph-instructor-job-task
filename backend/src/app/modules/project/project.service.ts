import { db } from "../../../prisma/db";
import { orderByField } from "@prisma/orm-postgres/orm-client";
import AppError from "../../utils/AppError";
import { paginationHelper } from "../../utils/paginationHelper";

type CreateProjectPayload = {
	name: string;
	repositoryUrl: string;
	liveUrl?: string;
	description: string;
};

type ProjectQuery = {
	page?: number;
	limit?: number;
	sortBy?: "name" | "createdAt" | "updatedAt" | "status";
	sortOrder?: "asc" | "desc";
	status?: "PENDING" | "APPROVED" | "REJECTED";
};

const SUBMISSION_WINDOW_MS = 60_000;
const SUBMISSION_LIMIT = 5;
const submissionAttempts = new Map<string, { count: number; windowStartedAt: number }>();

const checkSubmissionRate = (studentId: string) => {
	const now = Date.now();
	const attempt = submissionAttempts.get(studentId);

	if (!attempt || now - attempt.windowStartedAt >= SUBMISSION_WINDOW_MS) {
		submissionAttempts.set(studentId, { count: 1, windowStartedAt: now });
		return;
	}

	if (attempt.count >= SUBMISSION_LIMIT) {
		throw new AppError(429, "Submission limit reached. Please try again later.");
	}

	attempt.count += 1;
};

const submitProject = async (studentId: string, payload: CreateProjectPayload) => {
	checkSubmissionRate(studentId);

	const existingProject = await db.orm.public.Project.first({
		repositoryUrl: payload.repositoryUrl,
	});
	if (existingProject) {
		throw new AppError(409, "A project with this repository URL has already been submitted");
	}

	try {
		return await db.orm.public.Project.create({
			...payload,
			liveUrl: payload.liveUrl || null,
			studentId,
		});
	} catch (error) {
		if (
			typeof error === "object" &&
			error !== null &&
			"code" in error &&
			error.code === "P2002"
		) {
			throw new AppError(409, "A project with this repository URL has already been submitted");
		}
		throw error;
	}
};

const getMyProjects = async (studentId: string) => {
	return db.orm.public.Project.where({ studentId }).orderBy((project) => project.createdAt.desc()).all();
};

const getAllProjects = async (query: ProjectQuery) => {
	const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(query);
	const filter = query.status ? { status: query.status } : {};

	const [projects, countResult] = await Promise.all([
		db.orm.public.Project.where(filter)
			.orderBy(orderByField(db.orm.public.Project, sortBy, sortOrder, ["name", "createdAt", "updatedAt", "status"]))
			.limit(limit)
			.offset(skip)
			.all(),
		db.orm.public.Project.where(filter).aggregate((aggregate) => ({ total: aggregate.count() })),
	]);

	return { projects, total: countResult.total, page, limit };
};

const updateProjectStatus = async (projectId: string, status: "APPROVED" | "REJECTED") => {
	const project = await db.orm.public.Project.first({ id: projectId });
	if (!project) {
		throw new AppError(404, "Project not found");
	}
	if (project.status !== "PENDING") {
		throw new AppError(409, "Only pending projects can be reviewed");
	}

	return db.orm.public.Project.where({ id: projectId }).update({
		status,
		updatedAt: new Date(),
	});
};

const getProjectStatistics = async () => {
	const [totalPending, totalApproved, totalRejected] = await Promise.all([
		db.orm.public.Project.where({ status: "PENDING" }).aggregate((aggregate) => ({ total: aggregate.count() })),
		db.orm.public.Project.where({ status: "APPROVED" }).aggregate((aggregate) => ({ total: aggregate.count() })),
		db.orm.public.Project.where({ status: "REJECTED" }).aggregate((aggregate) => ({ total: aggregate.count() })),
	]);

	return {
		total: totalPending.total + totalApproved.total + totalRejected.total,
		totalPending: totalPending.total,
		totalApproved: totalApproved.total,
		totalRejected: totalRejected.total,
	};
};

export const ProjectService = {
	submitProject,
	getMyProjects,
	getAllProjects,
	updateProjectStatus,
	getProjectStatistics,
};
