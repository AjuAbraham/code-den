import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  compileCode,
  executeCode,
} from "../controllers/execution.controller.js";

const executionRouter = Router();

executionRouter.post("/compile", authMiddleware, compileCode);
executionRouter.post("/", authMiddleware, executeCode);

export default executionRouter;
