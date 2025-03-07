import { Router } from "express";
import { createWorkspaceController, inviteUserToWorkspace } from "../controllers/workspace.controller.js";
import { AuthMiddleware } from "../middlewares/authMiddleware.js";

const workspaceRouter = Router()

workspaceRouter.post('/', AuthMiddleware, createWorkspaceController)

workspaceRouter.post("/:workspace_id/invite/:invited_id", AuthMiddleware, inviteUserToWorkspace);

workspaceRouter.get("/", AuthMiddleware , getWorkspaces);

export default workspaceRouter
