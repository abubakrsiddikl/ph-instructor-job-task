import type { IUser } from "./auth.type";

export type ProjectStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ProjectStatusFilter = "ALL" | "APPROVED" | "REJECTED";


export interface Project {
  id: string;
  name: string;
  repositoryUrl: string;
  liveUrl: string | null;
  description: string;
  status: ProjectStatus;
  studentId: string;
  createdAt: Date;
  updatedAt: Date;
  student?: IUser;
}

export interface ProjectListResult {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPage: number;
  error?: string;
}

export interface ProjectStatistics {
  total: number;
  totalPending: number;
  totalApproved: number;
  totalRejected: number;
}

export interface ProjectActionState {
  success: boolean;
  message?: string;
  errors?: { field: string; message: string }[];
}