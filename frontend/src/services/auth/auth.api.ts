'use server';

import { registerZodSchema } from "@/zodSchema/auth.schema";
import { loginZodSchema } from "@/zodSchema/auth.schema";
import type { AuthActionState } from "@/types/auth.type";
import { apiRequest } from "../apiClient";

type AuthResponse = {
  accessToken?: string;
  refreshToken?: string;
  user?: { id: string; name: string; email: string; role: "STUDENT" | "ADMIN" };
};

type ApiAuthResponse = {
  success: boolean;
  message: string;
  errorSources?: { path: string; message: string }[];
  data?: AuthResponse;
};

const validationErrors = (issues: { path: PropertyKey[]; message: string }[]) =>
  issues.map((issue) => ({ field: String(issue.path[0] ?? ""), message: issue.message }));

const toActionState = (response: ApiAuthResponse): AuthActionState => ({
  success: response.success,
  message: response.message,
  errors: response.errorSources?.map((error) => ({
    field: error.path,
    message: error.message,
  })) ?? [],
  data: response.data,
});

export async function registerUser(
  _currentState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerZodSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    passwordHash: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: validationErrors(parsed.error.issues),
    };
  }

  const response = await apiRequest<AuthResponse>("/users/register", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });

  return toActionState(response as ApiAuthResponse);
}

export async function loginUser(
  _currentState: AuthActionState | null,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginZodSchema.safeParse({
    email: formData.get("email"),
    passwordHash: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors: validationErrors(parsed.error.issues),
    };
  }

  const response = await apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(parsed.data),
  });

  return toActionState(response as ApiAuthResponse);
}
