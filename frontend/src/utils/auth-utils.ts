import { TRole } from "../types/auth.type";

export type RouteConfig = {
  exact: string[];
  pattern: RegExp[];
};

// Auth routes (public)
export const authRoutes = [
  "/login",
  "/register",
  "/forget-password",
  "/reset-password",
];

// Common protected
export const commonProtectedRoutes: RouteConfig = {
  exact: ["/my-account"],
  pattern: [],
};

// student
export const studentProtectedRoutes: RouteConfig = {
  exact: ["/add-project"],
  pattern: [/^\/student/],
};

// MENTOR
export const mentorProtectedRoutes: RouteConfig = {
  exact: ["projects"],
  pattern: [/^\/mentor/],
};

// // ADMIN
// export const adminProtectedRoutes: RouteConfig = {
//   exact: [],
//   pattern: [/^\/admin/],
// };

// check route is authRoute
export const isAuthRoute = (pathname: string) => {
  return authRoutes.some((route) => route === pathname);
};

// check route isMatched
export const isMatched = (pathname: string, routes: RouteConfig) => {
  if (routes.exact.includes(pathname)) {
    return true;
  }
  return routes.pattern.some((pattern) => pattern.test(pathname));
};

// check route ownership
export const getRouteOwner = (
  pathname: string,
): "MENTOR" | "STUDENT" | "COMMON" | null => {
  if (isMatched(pathname, mentorProtectedRoutes)) {
    return "MENTOR";
  }
  if (isMatched(pathname, studentProtectedRoutes)) {
    return "STUDENT";
  }

  if (isMatched(pathname, commonProtectedRoutes)) {
    return "COMMON";
  }
  return null;
};

// default dashboard redirect
export const getDefaultDashboardRoute = (role: string) => {
  if (role === "MENTOR") {
    return "/mentor/dashboard";
  }
  if (role === "STUDENT") {
    return "/student/dashboard";
  }
};

// role validation
export const isValidRedirectForRole = (
  redirectPath: string,
  role: TRole,
): boolean => {
  const routeOwner = getRouteOwner(redirectPath);

  if (routeOwner === null || routeOwner === "COMMON") {
    return true;
  }

  if (routeOwner === role) {
    return true;
  }

  return false;
};
