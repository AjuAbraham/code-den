import { db } from "../db/index.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/errorHandler.js";

export const getAllSubmissions = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      throw new ErrorHandler(400, "User not authenticated");
    }
    const submission = await db.submission.findMany({
      where: {
        userId,
      },
    });
    res
      .status(200)
      .json(
        new ApiResponse(200, "Submission fetched successfully", submission)
      );
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});
export const getSubmissionForProblem = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      throw new ErrorHandler(400, "User not authenticated");
    }
    const { problemId } = req.params;
    if (!problemId) {
      throw new ErrorHandler(400, "Problem Id is required");
    }
    const submissions = await db.submission.findMany({
      where: {
        userId,
        problemId,
      },
    });
    if (!submissions) {
      throw new ErrorHandler(500, "Unable to fetch associated submissions");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, "Submission fetched successfully", submissions)
      );
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const getAllSubmissionsCountForProblem = asyncHandler(
  async (req, res) => {
    try {
      const { problemId } = req.params;
      if (!problemId) {
        throw new ErrorHandler(400, "Problem Id is required");
      }
      const submissionCount = await db.submission.count({
        where: {
          problemId,
        },
      });
      if (!submissionCount) {
        throw new ErrorHandler(400, "Unable to submission count");
      }
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            "Submission Count fetched successfully",
            submissionCount
          )
        );
    } catch (error) {
      res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
    }
  }
);
