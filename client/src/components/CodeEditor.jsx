import { Code, ListCheck, Minus, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

const CodeEditor = ({
  problem,
  code,
  setCode,
  selectedLanguage,
  resultRes,
  activeTab,
  setActiveTab,
  setSelectedLanguage,
}) => {
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
    { key: "result", icon: <Code className="w-4 h-4" />, label: "Result" },
  ];

  const { result, allPassed } = resultRes || {};

  return (
    <div className="h-[calc(100vh-120px)] w-full flex flex-col">
      <PanelGroup direction="vertical" className="h-full w-full">
        {/* Top Panel - Editor */}
        <Panel defaultSize={65} minSize={30}>
          {/* Language selector and reset */}
          <div className="flex items-center justify-between rounded-lg px-4 py-2 bg-slate-700 border-b border-slate-600">
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
          <div className="h-full">
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
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </Panel>

        <PanelResizeHandle className="h-3 w-full flex items-center ">
          <Minus className=" h-6  w-full cursor-pointer" />
        </PanelResizeHandle>

        {/* Bottom Panel - Test Cases or Result */}
        <Panel defaultSize={35} minSize={40}>
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

          <div className="bg-slate-900 border border-slate-700 border-t-0 rounded-b-xl p-4 text-white h-[calc(100%-52px)] overflow-y-auto">
            {/* Tab content */}
            {activeTab === "test_case" && testcases.length > 0 ? (
              <div>
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
                <div className="space-y-4">
                  <div>
                    <div className="text-indigo-300 font-semibold mb-1">
                      Input:
                    </div>
                    <pre className="bg-black/90 px-4 py-2 rounded-lg font-mono text-sm whitespace-pre-wrap">
                      {testcases[activeTestCase].input}
                    </pre>
                  </div>
                  <div>
                    <div className="text-indigo-300 font-semibold mb-1">
                      Expected Output:
                    </div>
                    <pre className="bg-black/90 px-4 py-2 rounded-lg font-mono text-sm whitespace-pre-wrap">
                      {testcases[activeTestCase].output}
                    </pre>
                  </div>
                </div>
              </div>
            ) : activeTab === "result" && result?.length > 0 ? (
              <div className="space-y-4">
                <div className="flex mb-4 border-b border-slate-700 overflow-x-auto">
                  {result.map((_, idx) => (
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

                <div
                  className={`p-4 rounded-lg border ${
                    allPassed
                      ? "border-green-500 bg-green-950/40"
                      : "border-red-500 bg-red-950/40"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-white">
                      Test Case {result[activeTestCase].testCase}
                    </h3>
                    <span
                      className={`text-sm font-semibold ${
                        allPassed ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {allPassed ? "Passed ✅" : "Failed ❌"}
                    </span>
                  </div>

                  <div className="text-sm">
                    <p className="text-indigo-300 font-medium">Your Output:</p>
                    <pre className="bg-black/80 rounded-md p-2 mb-2 whitespace-pre-wrap">
                      {result[activeTestCase].stdout || "No output"}
                    </pre>

                    <p className="text-indigo-300 font-medium">
                      Expected Output:
                    </p>
                    <pre className="bg-black/80 rounded-md p-2 mb-2 whitespace-pre-wrap">
                      {result[activeTestCase].expected || "N/A"}
                    </pre>

                    {result[activeTestCase].stderr && (
                      <>
                        <p className="text-red-300 font-medium">Error:</p>
                        <pre className="bg-black/80 rounded-md p-2 mb-2 whitespace-pre-wrap">
                          {result[activeTestCase].stderr}
                        </pre>
                      </>
                    )}

                    {result[activeTestCase].compile_output && (
                      <>
                        <p className="text-yellow-300 font-medium">
                          Compiler Output:
                        </p>
                        <pre className="bg-black/80 rounded-md p-2 mb-2 whitespace-pre-wrap">
                          {result[activeTestCase].compile_output}
                        </pre>
                      </>
                    )}

                    <div className="text-xs text-slate-400 mt-2">
                      Time: {result[activeTestCase].time || "N/A"} | Memory:{" "}
                      {result[activeTestCase].memory || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-slate-400 text-center">
                No test cases available.
              </div>
            )}
          </div>
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default CodeEditor;
