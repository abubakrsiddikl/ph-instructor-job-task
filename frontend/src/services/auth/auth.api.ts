/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { registerZodSchema } from "@/zodSchema/auth.schema";
import { loginZodSchema } from "@/zodSchema/auth.schema";
import type { ILoginResponse, IUser, TRole } from "@/types/auth.type";
import { apiRequest } from "../apiClient";
import { redirect } from "next/navigation";
import { deleteCookie, setCookie } from "./tokenHandlers";
import { getDefaultDashboardRoute } from "@/utils/auth-utils";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function registerUser(
  _currentState: any,
  formData: FormData,
): Promise<any> {
  const validatedFiled = registerZodSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    passwordHash: formData.get("password"),
  });

  // const validatedFiled = registerZodSchema.safeParse(data);

  if (!validatedFiled.success) {
    return {
      success: false,
      errors: validatedFiled.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    };
  }

  const res = await apiRequest("/users/register", {
    method: "POST",
    body: JSON.stringify(validatedFiled.data),
  });

  return res;
}

export async function loginUser(
  _currentState: any,
  formData: FormData,
): Promise<any> {
  const validatedFiled = loginZodSchema.safeParse({
    email: formData.get("email"),
    passwordHash: formData.get("password"),
  });
  // console.log("data",data)

  // const validatedFiled = loginZodSchema.safeParse(data);
  if (!validatedFiled.success) {
    return {
      success: false,
      errors: validatedFiled.error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    };
  }

  const res = await apiRequest<ILoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(validatedFiled.data),
  });
  if (!res.success) {
    return { success: false, message: res.message };
  }
  // set token in httpOnly cookie
  await setCookie("accessToken", res.data.accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
  });

  const verifiedToken: JwtPayload | string = jwt.verify(
    res.data.accessToken,
    process.env.JWT_ACCESS_SECRET as string,
  );
  if (typeof verifiedToken === "string") {
    throw new Error("Invalid Token");
  }
  // redirect(`/otp-verify?email=${validatedFiled.data.email}`);
  const userRole: TRole = verifiedToken.role;
  redirect(getDefaultDashboardRoute(userRole) as string);
}

// logout
export const logoutUser = async () => {
  await deleteCookie("accessToken");
  redirect("/login?loggedOut=true");
};

// get user profile from access token
export const getUserProfile = async (): Promise<IUser | null> => {
  const res = await apiRequest<IUser>("/users/profile", {
    method: "GET",
  });
  return res.success ? res.data : null;
};
