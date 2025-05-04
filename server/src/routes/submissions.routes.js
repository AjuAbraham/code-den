import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { getAllSubmissions, getAllSubmissionsCountForProblem, getSubmissionForProblem } from "../controllers/submissions.controller.js";

const submissionRouter = Router();

submissionRouter.get("/getall", authMiddleware, getAllSubmissions);
submissionRouter.get(
  "/getone/:problemId",
  authMiddleware,
  getSubmissionForProblem
);
submissionRouter.get(
  "/get-submission-count/:problemId",
  authMiddleware,
  getAllSubmissionsCountForProblem
);
export default submissionRouter;
