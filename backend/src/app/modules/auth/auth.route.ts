import express from "express";
import { AuthController } from "./auth.controller";
import { zodValidator } from "../../middleware/zodValidator";
import { loginUserSchema } from "./auth.validation";

const router = express.Router();

router.post("/login", zodValidator(loginUserSchema),AuthController.login);
router.post("/logout", AuthController.logout);

export const AuthRoutes = router;
