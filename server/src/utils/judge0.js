import ErrorHandler from "./errorHandler.js";
import axios from "axios";
export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };
  return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submissions) => {
  try {
    const { data } = await axios.post(
      `${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`,
      {
        submissions,
      }
    );
    return data;
  } catch (error) {
    console.log("error while creating batch submission", error);
    throw new ErrorHandler(500, "error while creating batch submission", error);
  }
};

export const customDelay = (miliSecond) =>
  new Promise((resolve) => setTimeout(resolve, miliSecond));
export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_URL}/submissions/batch`,
      {
        tokens: tokens.join(","),
        base64_encoded: false,
      }
    );
    const results = data.submissions;
    const isAllCasesResolved = results.every(
      (testCase) => testCase.status.id !== 1 && testCase.status.id !== 2
    );
    if (isAllCasesResolved) return results;
    await customDelay(1000);
  }
};
