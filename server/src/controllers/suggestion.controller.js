import { db } from "../db/index.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ApiResponse from "../utils/apiResponse.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import asyncHandler from "../utils/asyncHandler.js";

export const userSuggestion = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    const {
      days,
      hoursPerDay,
      targetCompany,
      title,
      description = undefined,
    } = req.body;
    const gemeni = new GoogleGenerativeAI(process.env.GEMENI_API);
    const model = gemeni.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });
    const problems = await db.problem.findMany({
      where: {
        difficulty: { in: ["EASY", "MEDIUM", "HARD"] },
        ...(targetCompany && {
          companies: { has: targetCompany },
        }),
      },
      select: {
        id: true,
        title: true,
        difficulty: true,
        tags: true,
      },
    });
    if (!problems) {
      throw new ErrorHandler(404, "Unable to find problems");
    }
    const shortListedProblem = problems
      .map(
        (problem) =>
          `${problem.title} (ID: ${problem.id}) - ${
            problem.difficulty
          }, Tags: ${problem.tags.join(", ")}`
      )
      .join("\n");
    const prompt = `
The user has ${days} days and can study ${hoursPerDay} hours per day.
They are targeting ${targetCompany || "general FAANG-style"} preparation.

Below is a list of coding problems from our database. Each problem includes a title, unique ID, difficulty level, and tags.

${shortListedProblem}

Your task:
- Cross-reference this list with well-known online coding preparation sheets like Striver’s DSA, NeetCode 150, Blind 75, etc.
- Select the most relevant and high-impact problems from this list to match the user's preparation window.

Rules:
- Prioritize important topics: Arrays, Strings, Dynamic Programming, Trees, Graphs, Backtracking, etc.
- Include a smart mix of Easy, Medium, and Hard problems.
- Select around ${Math.min(days * 2, 50)} problems total.
- Only include problems that exist in the list provided above (no external problems).
- Do not repeat any problem.
- Do not add explanations or formatting — return a pure JSON array of problem IDs only.

### Output format:
["uuid1", "uuid2", "uuid3", ...]
`;
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const problemList = JSON.parse(cleanedText);
    const playlist = await db.playlist.create({
      data: {
        title: title ? title : `Study Plan - ${days} Days`,
        userId: user.id,
        description,
      },
    });
    if (!playlist) {
      throw new ErrorHandler(500, "unable to create playlist");
    }
    const problemToSolve = await db.problemInPlaylist.createMany({
      data: problemList.map((problem) => ({
        problemId: problem,
        playlistId: playlist.id,
      })),
      skipDuplicates: true,
    });
    if (!problemToSolve) {
      throw new ErrorHandler(500, "Unable to save problem to playlist");
    }
    res.status(200).json(problemToSolve);
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message, success: error.success || false });
  }
});
