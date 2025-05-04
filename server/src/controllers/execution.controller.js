import { db } from "../db/index.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/errorHandler.js";
import {
  getLanguageName,
  pollBatchResults,
  submitBatch,
} from "../utils/judge0.js";

export const executeCode = asyncHandler(async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId } =
      req.body;
    const userid = req.user.id;
    if (!userid) {
      throw new ErrorHandler(400, "User must be logged in");
    }
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      throw new ErrorHandler(400, "Invalid or missing test cases");
    }
    const submissions = stdin.map((input) => ({
      source_code,
      stdin: input,
      language_id,
    }));

    //create batch submission and get tokens
    const createdSubmission = await submitBatch(submissions);
    const tokens = createdSubmission.map(({ token }) => token);
    if (!tokens) {
      throw new ErrorHandler(400, "Unable to create batch submission");
    }

    //poll judge0 to get all submitted test cases
    const results = await pollBatchResults(tokens);

    // anaysis of result
    let allPassed = true;
    const detailedResult = results.map((result, index) => {
      const passed = result.stdout?.trim() === expected_outputs[index]?.trim();
      if (!passed) {
        allPassed = false;
      }
      return {
        testCase: index + 1,
        passed,
        stdout: result.stdout?.trim(),
        expected: expected_outputs[index]?.trim(),
        stderr: result?.stderr || null,
        compile_output: result.compiled_output || null,
        status: result.status.description,
        memory: result.memory ? `${result.memory} KB` : undefined,
        time: result.time ? `${result.time} s` : undefined,
      };
    });

    //submit to db

    console.log(detailedResult);
    const submission = await db.submission.create({
      data: {
        userId: userid,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("/n"),
        stdout: JSON.stringify(detailedResult.map((result) => result.stdout)),
        stderr: detailedResult.some((result) => result.stderr)
          ? JSON.stringify(detailedResult.map((result) => result.stderr))
          : null,
        compileOutput: detailedResult.some((result) => result.compile_output)
          ? JSON.stringify(
              detailedResult.map((result) => result.compile_output)
            )
          : null,
        status: allPassed ? "Accepted" : "Rejected",
        memory: detailedResult.some((result) => result.memory)
          ? JSON.stringify(detailedResult.map((result) => result.memory))
          : null,
        time: detailedResult.some((result) => result.time)
          ? JSON.stringify(detailedResult.map((result) => result.time))
          : null,
      },
    });
    if (allPassed) {
      await db.problemSolved.upsert({
        where: {
          problemId_userId: {
            userId: userid,
            problemId,
          },
        },
        update: {},
        create: {
          userId: userid,
          problemId,
        },
      });
    }
    const testCaseResults = detailedResult.map((result) => ({
      submissionId: submission.id,
      testCase: result.testCase,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compileOutput,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));
    await db.testCase.createMany({
      data: testCaseResults,
    });
    const submittedData = await db.submission.findUnique({
      where: {
        id: submission.id,
      },
      include: {
        TestCase: true,
      },
    });
    if (!submittedData) {
      throw new ErrorHandler(500, "unable to fetch submitted result");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Problem submitted successfully", submittedData)
      );
  } catch (error) {
    return res.status(error.status || 500).json({ message: error.message });
  }
});
