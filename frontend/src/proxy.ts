import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import jwt, {type JwtPayload } from "jsonwebtoken";

import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
} from "./utils/auth-utils";
import { TRole } from "./types/auth.type";
import { deleteCookie, getCookie } from "./services/auth/tokenHandlers";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const accessToken = await getCookie("accessToken");

  let userRole: TRole | null = null;
  if (accessToken) {
    const verifiedToken: JwtPayload | string = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string,
    );
    if (typeof verifiedToken === "string") {
      await deleteCookie("accessToken");
      return NextResponse.redirect(new URL("/login", request.url));
    }
    userRole = verifiedToken.role;
  }
  const routeOwner = getRouteOwner(pathname);

  const isAuth = isAuthRoute(pathname);

  // Rule 1 : User is logged in and trying to access auth route. Redirect to default dashboard
  if (accessToken && isAuth) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole as TRole)!, request.url),
    );
  }
  // Rule 2 : User is trying to access open public route
  if (routeOwner === null) {
    return NextResponse.next();
  }

  // Rule 1 & 2 for open public routes and auth routes
  if (!accessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  // Rule 4 : User is trying to access common protected route
  if (routeOwner === "COMMON") {
    return NextResponse.next();
  }

  // Rule 5 : User is trying to access role based protected route
  if (routeOwner === "MENTOR" || routeOwner === "STUDENT") {
    if (userRole !== routeOwner) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as TRole)!, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
