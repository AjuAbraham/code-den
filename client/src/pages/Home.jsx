import { useQuery } from "@tanstack/react-query";
import { getAllProblems, topContributers } from "../lib/axios.js";
import { useNavigate } from "react-router-dom";
import ProblemList from "../components/ProblemList";
import { useState } from "react";
import authStore from "../store/authStore.js";

const Home = () => {
  const navigate = useNavigate();
  const { authUser } = authStore();
  const [filter, setFilter] = useState({
    difficulty: "",
    tags: [],
    companies: [],
    status: "",
  });

  const {
    data: initData,
    isLoading: initLoading,
    isError: initError,
    refetch: refetchInit,
  } = useQuery({
    queryKey: ["topContributer"],
    queryFn: topContributers,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: problemList,
    isLoading: problemLoading,
    isError: problemError,
    refetch: refetchProblems,
  } = useQuery({
    queryKey: ["getAllProblem"],
    queryFn: getAllProblems,
    staleTime: 1000 * 60 * 5,
  });

  if (initLoading || problemLoading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <span className="loading text-xl">Loading...</span>
      </div>
    );
  }

  if (initError || problemError) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4 text-center">
        <p className="text-red-400 text-xl font-semibold">
          🚨 Oops! Something went wrong while loading data.
        </p>
        <div className="flex gap-4">
          {initError && (
            <button
              onClick={() => refetchInit()}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
            >
              Retry Data
            </button>
          )}
          {problemError && (
            <button
              onClick={() => refetchProblems()}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
            >
              Retry Problem List
            </button>
          )}
        </div>
      </div>
    );
  }

  const topUsers = initData?.response || [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl mt-4 font-extrabold z-10 text-center">
        Hi! <span className="text-primary">{authUser.username}, </span>
        Welcome to <span className="text-primary">Code Den</span>
      </h1>
      <h1 className="text-2xl font-extrabold z-10 text-center">
        The Choti Bachi ++
      </h1>
      <div
        onClick={() => navigate("/sheets")}
        className="cursor-pointer group mx-60 relative overflow-hidden border border-primary bg-slate-800 hover:bg-slate-700 text-white rounded-2xl p-6 transition-shadow shadow hover:shadow-xl"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1 group-hover:text-orange-400 transition">
              📚 Explore Curated Sheets
            </h2>
            <p className="text-slate-400 text-sm max-w-md">
              Unlock handpicked sets of coding problems grouped by topic,
              company, or difficulty. Stay consistent and track your progress!
            </p>
          </div>
          <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-400 transition w-fit">
            Browse Sheets
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Problem List Area */}
        <div className="flex-1">
          <ProblemList
            problemList={problemList?.response}
            setFilter={setFilter}
            filter={filter}
            refetchProblems={refetchProblems}
          />
        </div>

        {/* Sidebar Area for Top Users */}
        <div className="w-full lg:w-80 mr-2 h-[500px] shrink-0 bg-slate-900 rounded-2xl p-4 border border-slate-700 shadow-md">
          <h2 className="text-xl font-bold text-white mb-4">
            🔥 Top Consistent Users
          </h2>
          <div className="flex flex-col gap-4">
            {topUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => navigate(`/user/${user.id}`)}
                className="bg-slate-800 cursor-pointer border border-slate-700 rounded-xl p-3 flex items-center gap-3 hover:shadow-lg transition"
              >
                <img
                  src={
                    user.avatar || "https://avatar.iran.liara.run/public/boy"
                  }
                  alt={user.username}
                  className="h-12 w-12 rounded-full object-cover border border-slate-600"
                />
                <div>
                  <p className="text-white font-medium">
                    {user.username.charAt(0).toUpperCase() +
                      user.username.slice(1).toLowerCase()}
                  </p>
                  <p className="text-orange-400 text-sm">
                    🔥 Max Streak: <strong>{user.streak}</strong>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
