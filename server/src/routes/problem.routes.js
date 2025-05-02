import { Router } from "express";
import {
  createProblem,
  deleteProblemById,
  getAllProblem,
  getAllSolvedProblems,
  getProblemById,
  updateProblemById,
} from "../controllers/problem.controller.js";
import { authMiddleware, checkAdmin } from "../middlewares/auth.middleware.js";

const problemRouter = Router();

problemRouter.post("/create", authMiddleware, checkAdmin, createProblem);
problemRouter.get("/getall", authMiddleware, getAllProblem);
problemRouter.get("/get/:id", authMiddleware, getProblemById);
problemRouter.put(
  "/update-problem/:id",
  authMiddleware,
  checkAdmin,
  updateProblemById
);
problemRouter.delete(
  "/delete-problem/:id",
  authMiddleware,
  checkAdmin,
  deleteProblemById
);
problemRouter.get("/get-solved-problems", authMiddleware, getAllSolvedProblems);

export default problemRouter;
