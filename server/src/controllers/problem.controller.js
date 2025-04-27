import { db } from "../db/index.js";
import asyncHandler from "../utils/asyncHandler.js";

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

  
});
export const getAllProblem = asyncHandler(async (req, res) => {});
export const getProblemById = asyncHandler(async (req, res) => {});
export const updateProblemById = asyncHandler(async (req, res) => {});
export const deleteProblemById = asyncHandler(async (req, res) => {});
export const getAllSolvedProblems = asyncHandler(async (req, res) => {});
