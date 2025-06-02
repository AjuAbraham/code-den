import { db } from "../db/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/errorHandler.js";
import ApiResponse from "../utils/apiResponse.js";

export const createSolution = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { problemId, tags, title, content } = req.body;
    if (!problemId) {
      throw new ErrorHandler(400, "problem Id is required");
    }
    const exsistingProblem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });
    if (!exsistingProblem) {
      throw new ErrorHandler(404, "Unable to find valid problem");
    }

    const createdSolution = await db.solutions.create({
      data: {
        problemId,
        title,
        tags,
        userId,
        content,
      },
    });
    if (!createdSolution) {
      throw new ErrorHandler(500, "Unable to create a solution");
    }
    res
      .status(201)
      .json(
        new ApiResponse(200, "Solution created successfully", createdSolution)
      );
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const createSolutionComment = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { solutionId, content, parentId } = req.body;
    if (!solutionId) {
      throw new ErrorHandler(400, "Solution id is required");
    }
    const exsistingSolution = await db.solutions.findUnique({
      where: {
        id: solutionId,
      },
    });
    if (!exsistingSolution) {
      throw new ErrorHandler(404, "Unable to find solution");
    }
    if (parentId) {
      const exsistingComment = await db.solutionDiscussion.findUnique({
        where: {
          id: parentId,
        },
      });
      if (!exsistingComment) {
        throw new ErrorHandler(404, "Unable to find main comment");
      }
      if (exsistingComment.solutionId !== solutionId) {
        throw new ErrorHandler(
          400,
          "Parent comment does not belong to this solution"
        );
      }
    }
    const createdComment = await db.solutionDiscussion.create({
      data: {
        content,
        solutionId,
        parentId: parentId ? parentId : undefined,
        userId,
      },
    });
    if (!createdComment) {
      throw new ErrorHandler(
        500,
        "Unable to create a new comment to the solution"
      );
    }
    res.status(201).json(new ApiResponse(201, "Comment created successfully"));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const getAllSolutions = asyncHandler(async (req, res) => {
  try {
    const { problemId } = req.params;
    if (!problemId) {
      throw new ErrorHandler(400, "Problem id is required");
    }
    const exsitingProblem = await db.problem.findUnique({
      where: {
        id: problemId,
      },
    });
    if (!exsitingProblem) {
      throw new ErrorHandler(404, "Unable to find the problem");
    }
    const getAllSolutions = await db.solutions.findMany({
      where: {
        problemId,
      },
      include: {
        solutionDiscussion: true,
        likes: true,
      },
    });
    if (!getAllSolutions) {
      throw new ErrorHandler(404, "Unable to get all solutions");
    }
    const updatedSolutions = getAllSolutions.map((solution) => ({
      ...solution,
      likes: solution.likes.length,
      solutionDiscussion: solution.solutionDiscussion.length,
    }));
    res
      .status(200)
      .json(
        new ApiResponse(200, "Solutions fetched successfully", updatedSolutions)
      );
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const getSingleSolution = asyncHandler(async (req, res) => {
  try {
    const { solutionId } = req.params;
    if (!solutionId) {
      throw new ErrorHandler(400, "Solution id is required");
    }
    const singleSolution = await db.solutions.findUnique({
      where: {
        id: solutionId,
      },
      include: {
        solutionDiscussion: {
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    if (!singleSolution) {
      throw new ErrorHandler(404, "Unable to find solution");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, "Solution fetched successfully", singleSolution)
      );
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const getDiscussionReplies = asyncHandler(async (req, res) => {
  try {
    const { discussionId } = req.params;
    if (!discussionId) {
      throw new ErrorHandler(400, "Discussion id is required");
    }
    const discussionReplies = await db.solutionDiscussion.findMany({
      where: {
        parentId: discussionId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!discussionReplies) {
      throw new ErrorHandler(404, "Unable to find discussion replies");
    }
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Discussion replies fetched successfully",
          discussionReplies
        )
      );
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});

export const likeSolution = asyncHandler(async (req, res) => {
  try {
    const userId = req.user.id;
    const { solutionId } = req.params;
    if (!solutionId) {
      throw new ErrorHandler(400, "Solution id is required");
    }
    const exsistingSolution = await db.solutions.findUnique({
      where: {
        id: solutionId,
      },
    });
    if (!exsistingSolution) {
      throw new ErrorHandler(404, "Unable to find the solution");
    }
    const likeSolution = await db.solutionLike.create({
      data: {
        userId,
        solutionId,
      },
    });
    if (!likeSolution) {
      throw new ErrorHandler(500, "Unable to like the solution");
    }
    res
      .status(200)
      .json(new ApiResponse(200, "Solution liked successfully", likeSolution));
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});
