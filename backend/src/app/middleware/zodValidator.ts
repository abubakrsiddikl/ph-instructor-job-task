import type { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const zodValidator =
  (zodSchema: ZodObject<any>, source: "body" | "query" = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (source === "query") {
        await zodSchema.parseAsync(req.query);
        next();
        return;
      }

      // req.body =JSON.parse(req.body.data || {}) || req.body
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }
      // console.log(req.body, "req.body");
      req.body = await zodSchema.parseAsync(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
