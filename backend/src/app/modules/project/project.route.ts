import express from "express";
import checkAuth from "../../middleware/checkAuth";
import { zodValidator } from "../../middleware/zodValidator";
import { ProjectController } from "./project.controller";
import {
  createProjectSchema,
  projectQuerySchema,
  updateProjectStatusSchema,
} from "./project.validation";

const router = express.Router();

router.post(
  "/",
  checkAuth("STUDENT"),
  zodValidator(createProjectSchema),
  ProjectController.submitProject,
);
router.get("/mine", checkAuth("STUDENT"), ProjectController.getMyProjects);
router.get(
  "/",
  checkAuth("MENTOR"),
  // zodValidator(projectQuerySchema),
  ProjectController.getAllProjects,
);
router.get(
  "/statistics",
  checkAuth("MENTOR"),
  ProjectController.getProjectStatistics,
);
router.patch(
  "/:id/status",
  checkAuth("MENTOR"),
  zodValidator(updateProjectStatusSchema),
  ProjectController.updateProjectStatus,
);

export const ProjectRoutes = router;
