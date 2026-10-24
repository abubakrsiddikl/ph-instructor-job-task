// import type { NextFunction, Request, Response } from "express";

// import httpStatus from "http-status";
// import AppError from "../utils/AppError";
// import { jwtHelpers } from "../utils/jwtHelper";
// import config from "../config";
// // import type { JwtPayload } from "jsonwebtoken";
// import type { JwtPayload } from "../types/jwt.type";

// const checkAuth = (...roles: string[]) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       let token = req.headers.authorization || req.cookies.accessToken;

//       if (token?.startsWith("Bearer ")) {
//         token = token?.split(" ")[1];
//       }
//       if (!token) {
//         throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
//       }
//       // console.log(token);

//       const verifiedUser = jwtHelpers.verifyToken(
//         token,
//         config.jwt.jwt_secret as string,
//       ) as JwtPayload;
//       // console.log("verify user", verifiedUser);

//       req.user = verifiedUser;

//       if (roles.length && !roles.includes(verifiedUser.role)) {
//         throw new AppError(httpStatus.FORBIDDEN, "Forbidden!");
//       }
//       next();
//     } catch (err) {
//       next(err);
//     }
//   };
// };

// export default checkAuth;

import type { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";
import { db } from "../../prisma/db";
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
      const verifiedUser = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;
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
