import { db } from "../db/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/errorHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from "../utils/judge0.js";

export const createProblem = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testcases,
    codeSnippit,
    referenceSolutions,
  } = req.body;
  try {
    if (req.user.role !== "ADMIN") {
      throw new ErrorHandler(400, "User not authorized");
    }
    for (const [language, solution] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        throw new ErrorHandler(400, "This language is not supported");
      }
      const submissions = testcases.map(({ input, output }) => {
        return {
          stdin: input,
          expected_output: output,
          source_code: solution,
          language_id: languageId,
        };
      });
      const submittedResult = await submitBatch(submissions);
      if (!submittedResult) {
        throw new ErrorHandler(500, "Unable to get batch tokens");
      }
      const tokens = submittedResult.map(({ token }) => token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          throw new ErrorHandler(
            400,
            `Test case ${i + 1} failed for ${language} `
          );
        }
      }
      const newProblem = await db.problem.create({
        data: {
          title,
          description,
          difficulty,
          tags,
          examples,
          constraints,
          hints,
          editorial,
          testcases,
          codeSnippit,
          referenceSolutions,
          userid: req.user.id,
        },
      });
      return res
        .status(201)
        .json(new ApiResponse(201, "Problem Created Successfully"));
    }
  } catch (error) {
    return res
      .status(error.statusCode)
      .json({ message: error.message, success: false });
  }
});
export const getAllProblem = asyncHandler(async (req, res) => {});
export const getProblemById = asyncHandler(async (req, res) => {});
export const updateProblemById = asyncHandler(async (req, res) => {});
export const deleteProblemById = asyncHandler(async (req, res) => {});
export const getAllSolvedProblems = asyncHandler(async (req, res) => {});
