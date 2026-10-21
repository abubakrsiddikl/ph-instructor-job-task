/* eslint-disable @typescript-eslint/no-explicit-any */

import { IErrorResponse, IResponse } from "@/types";
import { getCookie } from "./auth/tokenHandlers";
import { env } from "@/config/env";

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<IResponse<T>> {
  const token = await getCookie("accessToken");

  const defaultHeaders: HeadersInit = {
    ...(options?.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  try {
    const response = await fetch(`${env.baseUrl}${endpoint}`, {
      headers: {
        Cookie: token ? `accessToken=${token}` : "",
        ...defaultHeaders,
        ...options?.headers,
      },
      credentials: "include",
      ...options,
    });

    // console.log(response.headers)
    //  Parse JSON safely
    const data = await response.json();

    //  If response not OK → throw typed error
    if (!response.ok) {
      const error: IErrorResponse = {
        success: false,
        message: data.message || "API Request Failed",
        errorSources: data.errorSources,
        err: data.err,
        stack: data.stack,
      };
      throw error;
    }

    // Success return as typed data
    return data as IResponse<T>;
  } catch (error: any) {
    console.error("API Error:", error);

    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }

    const statusCode = error?.statusCode ?? error?.status ?? 500;

    return {
      success: false,
      statusCode,
      message: error?.message || "Unexpected error occurred",
      data: null as unknown as T,
      errorSources: error?.errorSources,
      err: error?.err,
      stack: error?.stack,
    } as IResponse<T>;
  }
}