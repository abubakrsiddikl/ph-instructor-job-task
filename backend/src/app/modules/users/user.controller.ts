import type { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { UserService } from "./user.service";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const user = await UserService.registerUser(req.body);
  // console.log(req.body,"this is hello")
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully",
    data: user,
  });
});

const getProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id as string;
  // console.log(req.user)
  const user = await UserService.getProfile(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: user,
  });
});

export const UserController = {
  registerUser,
  getProfile,
};
