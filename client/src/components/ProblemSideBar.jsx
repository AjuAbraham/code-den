import {
  FileText,
  MessageSquare,
  Lightbulb,
  Code2,
  CircleCheckBig,
  Plus,
} from "lucide-react";
import SubmissionsList from "./SubmissionsList";
import AcceptedSubmissionTab from "./AcceptedSubmissionTab";
import { useNavigate } from "react-router-dom";
import SolutionList from "./SolutionList";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { getoneSolution } from "../lib/axios";
import SolutionPreview from "./SolutionPreview";

const ProblemSideBar = ({
  problem,
  submissions = [],
  submissionLoading,
  activeTab,
  result,
  code,
  setActiveTab,
  solutions,
}) => {
  const navigate = useNavigate();
  const [solutionId, setSolutionId] = useState(null);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getoneSolution", solutionId],
    queryFn: () => getoneSolution(solutionId),
    staleTime: 1000 * 60 * 5,
    enabled: solutionId ? true : false,
  });

  if (isLoading) {
    return (
      <div className="flex h-fit justify-center mt-20">
        <span className="loading text-[16px]">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4 text-center">
        <p className="text-red-400 text-[16px] font-semibold">
          🚨 Oops! Something went wrong while loading data.
        </p>
        <button
          onClick={() => refetch()}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow text-[14px]"
        >
          Retry
        </button>
      </div>
    );
  }

  const selectedSolution = data?.response || {};
  const tabItems = [
    {
      key: "description",
      icon: <FileText className="w-4 h-4" />,
      label: "Description",
    },
    {
      key: "submissions",
      icon: <Code2 className="w-4 h-4" />,
      label: "Submissions",
    },
    {
      key: "solutions",
      icon: <MessageSquare className="w-4 h-4" />,
      label: "Solutions",
    },
    ...(Object.keys(result).length > 0
      ? [
          {
            key: "accepted",
            icon: <MessageSquare className="w-4 h-4" />,
            label: "Accepted",
          },
        ]
      : []),
    { key: "hints", icon: <Lightbulb className="w-4 h-4" />, label: "Hints" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none h-full text-white">
            <div className="flex items-center justify-between w-full">
              <p className="text-[20px] tracking-wide w-full font-bold mb-2">
                {problem.title}
              </p>
              {submissions.length > 0 ? (
                <p className="text-green-600 flex items-center gap-2 text-[14px]">
                  <CircleCheckBig />
                  Solved
                </p>
              ) : null}
            </div>
            <p className="text-[14px] mb-6">{problem.description}</p>
            {problem.companies && problem.companies.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-6 mt-2">
                {problem.companies.map((company, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-4 py-1.5 rounded-full text-[13px] font-semibold bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg hover:scale-105 hover:shadow-purple-500/50 transition-transform duration-200 ease-in-out"
                  >
                    {company}
                  </span>
                ))}
              </div>
            )}
            {problem.examples && (
              <>
                <h3 className="text-[18px] font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(([lang, example]) => (
                  <div
                    key={lang}
                    className="bg-slate-800 border w-full border-slate-700 p-6 rounded-xl mb-6 font-mono"
                  >
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 text-[14px] font-semibold">
                        Input:
                      </div>
                      <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-[13px]">
                        {example.input}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 text-[14px] font-semibold">
                        Output:
                      </div>
                      <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-[13px]">
                        {example.output}
                      </span>
                    </div>
                    {example.explanation && (
                      <div>
                        <div className="text-emerald-300 mb-2 text-[14px] font-semibold">
                          Explanation:
                        </div>
                        <p className="text-slate-300 text-[14px]">
                          {example.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}
            {problem.constraints && (
              <>
                <h3 className="text-[18px] font-bold mb-4">Constraints:</h3>
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl mb-6">
                  <div className="flex flex-col gap-4 w-full">
                    {problem.constraints
                      .split("\n")
                      .map((constraint, index) => (
                        <span
                          key={index}
                          className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-[14px]"
                        >
                          {constraint}
                        </span>
                      ))}
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "submissions":
        return submissions ? (
          <SubmissionsList
            submissions={submissions}
            isLoading={submissionLoading}
          />
        ) : (
          <div className="p-4 text-center text-slate-400 text-[14px]">
            No submissions yet
          </div>
        );
      case "solutions":
        return (
          <>
            {Object.keys(selectedSolution).length > 0 ? (
              <SolutionPreview
                solution={selectedSolution}
                setSolutionId={setSolutionId}
                refetch={refetch}
              />
            ) : (
              <>
                <div className="p-2 w-full flex justify-end">
                  <button
                    onClick={() =>
                      navigate(`/solution/create/${problem.id}`, {
                        state: { code },
                      })
                    }
                    disabled={
                      !(
                        submissions.length > 0 &&
                        submissions[0]?.status === "Accepted"
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary disabled:bg-gray-500 disabled:pointer-events-none text-white hover:bg-primary/90 transition text-[14px]"
                  >
                    <Plus className="w-4 h-4" />
                    Create Solution
                  </button>
                </div>
                {solutions.length > 0 ? (
                  <SolutionList
                    solutions={solutions}
                    setSolutionId={setSolutionId}
                  />
                ) : (
                  <div className="p-4 text-center text-slate-400 text-[14px]">
                    No solutions yet
                  </div>
                )}
              </>
            )}
          </>
        );
      case "hints":
        return (
          <div className="flex flex-col gap-4 p-6 text-white">
            <h2 className="text-[20px] font-bold text-yellow-400 flex items-center gap-2">
              <Lightbulb className="w-6 h-6" />
              Hints
            </h2>
            {problem?.hints ? (
              <div className="flex flex-col gap-4">
                {problem.hints.map((hint, index) => (
                  <div
                    key={index}
                    className="group relative border border-slate-700 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 p-5 transition-all hover:border-yellow-400 shadow-md"
                  >
                    <div className="absolute -top-3 -left-3 bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-[12px] shadow-md">
                      {index + 1}
                    </div>
                    <p className="text-slate-200 text-[14px] leading-relaxed transition-all group-hover:text-yellow-200">
                      {hint}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 text-[14px]">
                No hints available
              </div>
            )}
          </div>
        );
      case "accepted":
        return <AcceptedSubmissionTab submission={result} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl">
      <div className="rounded-2xl bg-slate-900 border border-slate-700 shadow-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-700 bg-slate-800">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center cursor-pointer gap-2 px-6 py-3 text-[14px] font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.key
                  ? "border-orange-400 text-orange-400 bg-slate-900"
                  : "border-transparent text-slate-300 hover:text-orange-300 hover:bg-slate-700"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 bg-slate-900 mb-2 h-[calc(100dvh-180px)] overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default ProblemSideBar;
