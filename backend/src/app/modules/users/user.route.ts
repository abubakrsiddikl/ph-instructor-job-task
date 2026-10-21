import express from "express";

import { UserController } from "./user.controller";
import { registerUserSchema } from "./user.validation";
import { zodValidator } from "../../middleware/zodValidator";

const router = express.Router();

router.post(
  "/register",
  zodValidator(registerUserSchema),
  UserController.registerUser,
);

export const UserRoutes = router;
