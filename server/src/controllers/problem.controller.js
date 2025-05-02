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
    codeSnippets,
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
          // hints,
          // editorial,
          testcases,
          codeSnippets,
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
      .status(error.statusCode || 500)
      .json({ message: error.message, success: false });
  }
});
export const getAllProblem = asyncHandler(async (req, res) => {
  try {
    const problems = await db.problem.findMany();
    if (!problems) {
      throw new ErrorHandler(404, "Unable to fetch problems");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Problems fetched successfully", problems));
  } catch (error) {
    res.status(error.statusCode).json({ message: error.message });
  }
});
export const getProblemById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ErrorHandler(400, "Problem Id is required");
    }
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      throw new ErrorHandler(404, "Unable to get the problem");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Problem fetched successfully!!", problem));
  } catch (error) {
    return res.status(error.statusCode).json({ message: error.message });
  }
});
export const updateProblemById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
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
      codeSnippets,
      referenceSolutions,
    } = req.body;
    if (!id) {
      throw new ErrorHandler(400, "Problem Id is required");
    }
    for (const [language, solution] of Object.entries(referenceSolutions)) {
      const languageId = getJudge0LanguageId(language);
      if (!languageId) {
        throw new ErrorHandler(400, "Language not supported");
      }
      const submissions = testcases.map(({ input, output }) => {
        return {
          stdin: input,
          expected_output: output,
          language_id: languageId,
          source_code: solution,
        };
      });
      const createdBatch = await submitBatch(submissions);
      const tokens = createdBatch.map(({ token }) => token);
      const results = pollBatchResults(tokens);
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          throw new ErrorHandler(
            400,
            `Test Case${i + 1} failed for ${language} language`
          );
        }
      }
    }
    const updatedProblem = await db.problem.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        // hints,
        // editorial,
        testcases,
        codeSnippets,
        referenceSolutions,
      },
    });
    if (!updatedProblem) {
      throw new ErrorHandler(400, "Failed to update the problem");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, "Problem updated successfullt", updatedProblem)
      );
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message });
  }
});
export const deleteProblemById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ErrorHandler(400, "Problem Id is required");
    }
    const exsistingProblem = await db.problem.findUnique({ where: { id } });
    if (!exsistingProblem) {
      throw new ErrorHandler(404, "Problem does'nt exsist");
    }
    const deletedProblem = await db.problem.delete({ where: { id } });
    if (!deletedProblem) {
      throw new ErrorHandler(500, "Problem was not deleted successfully");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Problem Deleted successfully"));
  } catch (error) {
    return res.status(error.statusCode).json({ message: error.message });
  }
});

export const getAllSolvedProblems = asyncHandler(async (req, res) => {});
