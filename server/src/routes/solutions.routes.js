import { Router } from "express";
import {
  createSolution,
  createSolutionComment,
  getSingleSolution,
  getDiscussionReplies,
  likeSolution,
  getAllSolutions,
} from "../controllers/solutions.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const solutionRouter = Router();

solutionRouter.post("/create", authMiddleware, createSolution);
solutionRouter.post("/create-comment", authMiddleware, createSolutionComment);
solutionRouter.get("/getone/:solutionId", authMiddleware, getSingleSolution);
solutionRouter.get("/getall/:problemId", getAllSolutions);
solutionRouter.get("/get-replies/:discussionId", getDiscussionReplies);
solutionRouter.post("/like/:solutionId", authMiddleware, likeSolution);

export default solutionRouter;
