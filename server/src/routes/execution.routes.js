import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { executeCode } from "../controllers/execution.controller.js";

const executionRouter = Router();

executionRouter.post("/", authMiddleware, executeCode);

export default executionRouter;
