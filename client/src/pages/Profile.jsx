import { useQuery } from "@tanstack/react-query";
import { userProfile } from "../lib/axios";
import moment from "moment";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { useParams } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: () => userProfile(id),
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen justify-center items-center bg-gray-950">
        <span className="text-lg text-gray-300 animate-pulse">Loading...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 text-center bg-gray-950">
        <p className="text-red-400 text-xl font-medium animate-pulse">
          🚨 Oops! Something went wrong.
        </p>
        <button
          onClick={() => refetch()}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-4 py-1.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        >
          Retry
        </button>
      </div>
    );
  }

  const user = data?.response || {};
  const { totalProblems = {}, difficultyCount = {} } = user;

  const heatmapData = user.DailyActivity?.map((activity) => ({
    date: moment(activity.date).format("YYYY-MM-DD"),
    count: 1,
  })).reduce((acc, curr) => {
    const existing = acc.find((item) => item.date === curr.date);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push(curr);
    }
    return acc;
  }, []);

  const endDate = moment();
  const startDate = moment().subtract(4, "months");

  return (
    <div className="min-h-screen px-3 py-4 bg-gray-950 text-white">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-lg shadow-md border border-gray-700">
          <div className="flex items-center gap-3">
            <img
              src={user?.avatar || "https://avatar.iran.liara.run/public/boy"}
              alt="User Avatar"
              className="h-10 w-10 rounded-full object-cover border border-slate-700"
            />
            <div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                {user.username}
              </h1>
              <p className="text-xs text-gray-400">{user.email}</p>
              <p className="text-[10px] mt-0.5 text-gray-500 uppercase tracking-wide">
                {user.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-800 px-4 py-2 rounded-lg border border-gray-600 shadow-inner">
            <svg
              className="w-4 h-4 text-orange-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M12 2a1 1 0 011 1v1h3a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h3V3a1 1 0 011-1h4z" />
            </svg>
            <div>
              <p className="text-[10px] text-gray-400">Current Streak</p>
              <p className="text-lg font-medium text-orange-400">
                {user.streak} days
              </p>
            </div>
          </div>
        </div>

        {/* Doughnut Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {["EASY", "MEDIUM", "HARD"].map((level) => {
            const value = difficultyCount[level] || 0;
            const total = totalProblems?.[level] || 1;
            const colorMap = {
              EASY: "#22c55e",
              MEDIUM: "#facc15",
              HARD: "#ef4444",
            };
            const color = colorMap[level];

            const chartData = {
              datasets: [
                {
                  data: value === 0 ? [1] : [value, total - value],
                  backgroundColor:
                    value === 0 ? ["#374151"] : [color, "#334155"],
                  borderWidth: 0,
                },
              ],
            };

            const chartOptions = {
              cutout: "75%",
              plugins: {
                legend: { display: false },
                tooltip: { enabled: true },
              },
              responsive: true,
              maintainAspectRatio: false,
            };

            return (
              <div
                key={level}
                className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-center shadow-sm hover:shadow-orange-500/20 hover:scale-[1.02] transition-transform duration-200"
              >
                <h2
                  className={`text-sm font-medium ${
                    level === "EASY"
                      ? "text-green-400"
                      : level === "MEDIUM"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {level}
                </h2>
                <div className="relative w-24 h-24 mx-auto my-2">
                  <Doughnut data={chartData} options={chartOptions} />
                  <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-semibold">
                    {value}
                  </div>
                </div>
                <p className="text-lg font-medium text-orange-400">
                  {value} / {total}
                </p>
              </div>
            );
          })}
        </div>

        {/* Heatmap + Recently Solved */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Heatmap */}
          <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg
                className="w-4 h-4 text-orange-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6z" />
              </svg>
              <h2 className="text-base font-medium text-gray-200">
                Daily Activity
              </h2>
            </div>
            <div className="relative heatmap-wrapper">
              <style>
                {`
                  .react-calendar-heatmap .color-empty { fill: #2d3a4b; }
                  .react-calendar-heatmap .color-scale-1 { fill: #16a34a; }
                  .react-calendar-heatmap .color-scale-2 { fill: #22c55e; }
                  .react-calendar-heatmap .color-scale-3 { fill: #4ade80; }
                  .react-calendar-heatmap .color-scale-4 { fill: #86efac; }
                  .react-calendar-heatmap rect {
                    rx: 2px;
                    ry: 2px;
                  }
                  .react-calendar-heatmap rect:hover {
                    stroke: #f97316;
                    stroke-width: 1px;
                  }
                  .react-calendar-heatmap text {
                    fill: #9ca3af;
                    font-size: 8px;
                  }
                `}
              </style>
              <CalendarHeatmap
                startDate={startDate.toDate()}
                endDate={endDate.toDate()}
                values={heatmapData}
                classForValue={(value) => {
                  if (!value) return "color-empty";
                  return `color-scale-${Math.min(value.count, 4)}`;
                }}
                titleForValue={(value) =>
                  value
                    ? `${moment(value.date).format("DD MMM")} - ${
                        value.count
                      } activit${value.count === 1 ? "y" : "ies"}`
                    : null
                }
                showMonthLabels
                gutterSize={3}
              />
            </div>
          </div>

          {/* Recently Solved */}
          <div className="bg-gray-800 border border-gray-700 p-3 rounded-lg shadow-sm">
            <h2 className="text-base font-medium text-gray-200 mb-3">
              Recently Solved
            </h2>
            <div className="overflow-x-auto max-h-80">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-gray-300 border-b border-gray-600">
                    <th className="py-1.5 px-2">Title</th>
                    <th className="py-1.5 px-2">Difficulty</th>
                    <th className="py-1.5 px-2">Solved At</th>
                  </tr>
                </thead>
                <tbody>
                  {user.recentlySolved?.length ? (
                    user.recentlySolved.map((p, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors duration-200"
                      >
                        <td className="py-1.5 px-2 text-orange-300">
                          {p.title}
                        </td>
                        <td
                          className={`py-1.5 px-2 font-medium ${
                            p.difficulty === "EASY"
                              ? "text-green-400"
                              : p.difficulty === "MEDIUM"
                              ? "text-yellow-400"
                              : "text-red-400"
                          }`}
                        >
                          {p.difficulty}
                        </td>
                        <td className="py-1.5 px-2 text-gray-400">
                          {moment(p.solvedAt).format("DD MMM, hh:mm A")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-4 text-gray-400"
                      >
                        No recent solves yet
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
