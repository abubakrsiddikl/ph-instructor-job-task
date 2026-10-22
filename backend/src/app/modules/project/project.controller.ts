import type { Request, Response } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import pick from "../../utils/pick";
import sendResponse from "../../utils/sendResponse";
import { ProjectService } from "./project.service";

const submitProject = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.user,"req user")
  const project = await ProjectService.submitProject(req.user!.id, req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Project submitted successfully",
    data: project,
  });
});

const getMyProjects = catchAsync(async (req: Request, res: Response) => {
  const projects = await ProjectService.getMyProjects(req.user!.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Your projects retrieved successfully",
    data: projects,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  //  console.log("hello")
  const query = pick(req.query, [
    "page",
    "limit",
    "sortBy",
    "sortOrder",
    "status",
  ]);
  //  console.log("hello")
  const result = await ProjectService.getAllProjects(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Projects retrieved successfully",
    meta: { page: result.page, total: result.total, limit: result.limit },
    data: result.projects,
  });
});

const updateProjectStatus = catchAsync(async (req: Request, res: Response) => {
  // console.log(req.body,"req body")
  const project = await ProjectService.updateProjectStatus(
    String(req.params.id),
    req.body.status,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Project ${req.body.status.toLowerCase()} successfully`,
    data: project,
  });
});

const getProjectStatistics = catchAsync(
  async (_req: Request, res: Response) => {
    const statistics = await ProjectService.getProjectStatistics();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Project statistics retrieved successfully",
      data: statistics,
    });
  },
);

export const ProjectController = {
  submitProject,
  getMyProjects,
  getAllProjects,
  updateProjectStatus,
  getProjectStatistics,
};
