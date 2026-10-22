import type { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import AppError from "../utils/AppError";
import { jwtHelpers } from "../utils/jwtHelper";
import config from "../config";
// import type { JwtPayload } from "jsonwebtoken";
import type { JwtPayload } from "../types/jwt.type";

const checkAuth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.headers.authorization || req.cookies.accessToken;

      if (token?.startsWith("Bearer ")) {
        token = token?.split(" ")[1];
      }
      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }
      // console.log(token);

      const verifiedUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as string,
      ) as JwtPayload;
      // console.log("verify user", verifiedUser);
    
      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default checkAuth;

// import type { NextFunction, Request, Response } from "express";
// // import type { JwtPayload } from "jsonwebtoken";
// import AppError from "../utils/AppError";
// import { jwtHelpers } from "../utils/jwtHelper";
// import config from "../config";
// import { db } from "../../prisma/db";
// import httpStatus from "http-status";
// import type { JwtPayload } from "../types/jwt.type";

// export const checkAuth =
//   (...authRoles: string[]) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       let accessToken = req.cookies.accessToken || req.headers.authorization;
//       if (accessToken?.startsWith("Bearer ")) {
//         accessToken = accessToken?.split(" ")[1];
//       }
//       if (!accessToken) {
//         throw new AppError(403, "No Token Received");
//       }

//       const verifiedToken = jwtHelpers.verifyToken(
//         accessToken,
//         config.jwt.jwt_secret as string,
//       ) as JwtPayload;

//       const isUserExist = await db.orm.public.User.first({
//         id: verifiedToken.id as string,
//       });

//       if (!isUserExist) {
//         throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
//       }

//       if (!authRoles.includes(verifiedToken.role)) {
//         throw new AppError(403, "You are not permitted to view this route!!!");
//       }
//       req.user = verifiedToken as { id: string; email: string; role: string };

//       next();
//     } catch (error) {
//       console.log("jwt error", error);
//       next(error);
//     }
//   };
