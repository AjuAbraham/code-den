import {
  CheckCircle2,
  XCircle,
  Clock,
  MemoryStick as Memory,
} from "lucide-react";

const SubmissionResults = ({ submission }) => {
  const memoryArr = JSON.parse(submission.memory || "[]");
  const timeArr = JSON.parse(submission.time || "[]");

  const avgMemory =
    memoryArr.reduce((a, b) => a + parseFloat(b), 0) / memoryArr.length || 0;
  const avgTime =
    timeArr.reduce((a, b) => a + parseFloat(b), 0) / timeArr.length || 0;

  const passedTests = submission.TestCase.filter((tc) => tc.passed).length;
  const totalTests = submission.TestCase.length;
  const successRate = (passedTests / totalTests) * 100;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Status */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-white">
          <div className="text-sm text-slate-400">Status</div>
          <div
            className={`text-xl font-semibold ${
              submission.status === "Accepted"
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            {submission.status}
          </div>
        </div>

        {/* Success Rate */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-white">
          <div className="text-sm text-slate-400">Success Rate</div>
          <div className="text-xl font-semibold">{successRate.toFixed(1)}%</div>
        </div>

        {/* Avg Runtime */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-white">
          <div className="text-sm flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            Avg. Runtime
          </div>
          <div className="text-xl font-semibold">{avgTime.toFixed(3)} s</div>
        </div>

        {/* Avg Memory */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 text-white">
          <div className="text-sm flex items-center gap-2 text-slate-400">
            <Memory className="w-4 h-4" />
            Avg. Memory
          </div>
          <div className="text-xl font-semibold">{avgMemory.toFixed(0)} KB</div>
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 text-white">
        <h2 className="text-lg font-semibold mb-4">Test Case Results</h2>
        <div className="overflow-x-auto">
          <table className="table w-full text-sm">
            <thead className="text-slate-400 border-b border-slate-700">
              <tr>
                <th>Status</th>
                <th>Expected Output</th>
                <th>Your Output</th>
                <th>Memory</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {submission.TestCase.map((testCase, i) => (
                <tr
                  key={testCase.id}
                  className="hover:bg-slate-700/30 transition-all"
                >
                  <td>
                    <div
                      className={`flex items-center gap-2 font-medium ${
                        testCase.passed ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {testCase.passed ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      {testCase.passed ? "Passed" : "Failed"}
                    </div>
                  </td>
                  <td className="font-mono text-slate-300">
                    {testCase.expected}
                  </td>
                  <td className="font-mono text-slate-300">
                    {testCase.stdout || "null"}
                  </td>
                  <td>{testCase.memory}</td>
                  <td>{testCase.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubmissionResults;
