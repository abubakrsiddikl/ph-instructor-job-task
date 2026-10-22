import express from "express";

import { UserController } from "./user.controller";
import { registerUserSchema } from "./user.validation";
import { zodValidator } from "../../middleware/zodValidator";
import checkAuth from "../../middleware/checkAuth";

const router = express.Router();

router.post(
  "/register",
  zodValidator(registerUserSchema),
  UserController.registerUser,
);
router.get("/profile", checkAuth("STUDENT","MENTOR"), UserController.getProfile);

export const UserRoutes = router;
