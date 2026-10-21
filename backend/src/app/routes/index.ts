import express from "express";
import { UserRoutes } from "../modules/users/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ProjectRoutes } from "../modules/project/project.route";

const router = express.Router();

const moduleRoutes = [
	{ path: "/users", route: UserRoutes },
	{ path: "/auth", route: AuthRoutes },
	{ path: "/projects", route: ProjectRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
