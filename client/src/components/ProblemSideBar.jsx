import { FileText, MessageSquare, Lightbulb, Code2 } from "lucide-react";

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
    key: "discussion",
    icon: <MessageSquare className="w-4 h-4" />,
    label: "Discussion",
  },
  { key: "hints", icon: <Lightbulb className="w-4 h-4" />, label: "Hints" },
];

const ProblemSideBar = ({ problem, activeTab, setActiveTab }) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="prose max-w-none h-full text-white">
            <p className="text-2xl tracking-wide w-full font-bold mb-2">
              {problem.title}
            </p>
            <p className="text-base mb-6">{problem.description}</p>
            {problem.examples && (
              <>
                <h3 className="text-xl font-bold mb-4">Examples:</h3>
                {Object.entries(problem.examples).map(([lang, example]) => (
                  <div
                    key={lang}
                    className="bg-slate-800 border w-full border-slate-700 p-6 rounded-xl mb-6 font-mono"
                  >
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 text-base font-semibold">
                        Input:
                      </div>
                      <span className="bg-black/90 px-4 py-1  rounded-lg font-semibold text-white">
                        {example.input}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="text-indigo-300 mb-2 text-base font-semibold">
                        Output:
                      </div>
                      <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white">
                        {example.output}
                      </span>
                    </div>
                    {example.explanation && (
                      <div>
                        <div className="text-emerald-300 mb-2 text-base font-semibold">
                          Explanation:
                        </div>
                        <p className="text-slate-300 text-lg font-sem">
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
                <h3 className="text-xl font-bold mb-4">Constraints:</h3>
                <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl mb-6">
                  <div className="flex flex-col gap-4 w-[50%]">
                    {problem.constraints
                      .split("\n")
                      .map((constraint, index) => (
                        <span
                          key={index}
                          className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg"
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
        return problem.submission ? (
          <SubmissionsList
            submissions={problem.submission}
            isLoading={problem.submission}
          />
        ) : (
          <div className="p-4 text-center text-slate-400">
            No submissions yet
          </div>
        );
      case "discussion":
        return (
          <div className="p-4 text-center text-slate-400">
            No discussions yet
          </div>
        );
      case "hints":
        return (
          <div className="flex flex-col gap-4 p-6 text-white">
            <h2 className="text-2xl font-bold text-yellow-400 flex items-center gap-2">
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
                    <div className="absolute -top-3 -left-3 bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md">
                      {index + 1}
                    </div>
                    <p className="text-slate-200 text-base leading-relaxed transition-all group-hover:text-yellow-200">
                      {hint}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400">
                No hints available
              </div>
            )}
          </div>
        );
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
              className={`flex items-center cursor-pointer gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
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
        <div className="p-6 bg-slate-900">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default ProblemSideBar;
