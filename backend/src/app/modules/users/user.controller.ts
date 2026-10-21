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

export const UserController = {
  registerUser,
};
