import { Code, ListCheck, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

const CodeEditor = ({ problem }) => {
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("test_case");
  const [activeTestCase, setActiveTestCase] = useState(0);
  const [testcases, setTestCases] = useState([]);

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");
      setTestCases(
        problem.testcases?.map((tc) => ({
          input: tc.input,
          output: tc.output,
        })) || []
      );
    }
  }, [problem, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const tabItems = [
    {
      key: "test_case",
      icon: <ListCheck className="w-4 h-4" />,
      label: "Test Cases",
    },
    {
      key: "result",
      icon: <Code className="w-4 h-4" />,
      label: "Result",
    },
  ];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Language Select + Reset */}
      <div className="card-body p-0 w-full">
        <div className="flex items-center justify-between px-4 py-2 rounded-lg bg-slate-700 border border-slate-600">
          <div className="flex items-center gap-2">
            <label
              htmlFor="language"
              className="text-white font-semibold text-sm"
            >
              Language:
            </label>
            <select
              id="language"
              className="bg-slate-800 text-white border border-slate-600 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              {Object.keys(problem.codeSnippets || {}).map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() =>
              setCode(problem.codeSnippets?.[selectedLanguage] || "")
            }
            className="flex items-center cursor-pointer gap-1 text-sm bg-slate-800 text-slate-300 hover:text-orange-400 border border-slate-600 hover:border-orange-400 rounded-md px-3 py-1 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {/* Editor */}
        <div className="h-[590px] w-full mt-[-0.5rem]">
          <Editor
            height="100%"
            language={selectedLanguage.toLowerCase()}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              lineNumbers: "on",
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>
      <div>
        <div className="flex border-b border-slate-700 bg-slate-800 rounded-t-xl">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
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

        {/* Tab Content */}
        <div className="bg-slate-900 border border-slate-700 border-t-0 rounded-b-xl p-4 text-white">
          {activeTab === "test_case" && testcases.length > 0 ? (
            <div>
              {/* Sub-tabs for Test Cases */}
              <div className="flex mb-4 border-b border-slate-700 overflow-x-auto">
                {testcases.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestCase(idx)}
                    className={`px-4 py-2 text-sm font-medium cursor-pointer ${
                      activeTestCase === idx
                        ? "text-orange-400 border-b-2 border-orange-400"
                        : "text-slate-300 hover:text-orange-300"
                    }`}
                  >
                    Case {idx + 1}
                  </button>
                ))}
              </div>

              {/* Active Test Case View */}
              <div className="space-y-4">
                <div>
                  <div className="text-indigo-300 text-base font-semibold mb-1">
                    Input:
                  </div>
                  <pre className="bg-black/90 px-4 py-2 rounded-lg font-mono text-sm text-white whitespace-pre-wrap">
                    {testcases[activeTestCase].input}
                  </pre>
                </div>
                <div>
                  <div className="text-indigo-300 text-base font-semibold mb-1">
                    Expected Output:
                  </div>
                  <pre className="bg-black/90 px-4 py-2 rounded-lg font-mono text-sm text-white whitespace-pre-wrap">
                    {testcases[activeTestCase].output}
                  </pre>
                </div>
              </div>
            </div>
          ) : activeTab === "result" ? (
            <div className="text-slate-400 text-center">
              Results will appear here.
            </div>
          ) : (
            <div className="text-slate-400 text-center">
              No test cases available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
