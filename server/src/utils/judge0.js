
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
  const { data } = await axios.post(
    `${process.env.JUDGE0_URL}/submissions/batch?base64_encoded=false`,
    {
      submissions,
    }
  );
  return data;
};

export const customDelay = (miliSecond) =>
  new Promise((resolve) => setTimeout(resolve, miliSecond));
export const pollBatchResults = async (tokens) => {
  while (true) {
    const { data } = await axios.get(
      `${process.env.JUDGE0_URL}/submissions/batch`,
      {
        params: { tokens: tokens.join(","), base64_encoded: false },
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

export const getLanguageName = (languageId) => {
  if (!languageId) return null;
  const languageMap = {
    71: "Python",
    74: "TypeScript",
    63: "Javascript",
    62: "Java",
  };
  return languageMap[languageId] || "Unkown";
};
