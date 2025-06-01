import { useQuery } from "@tanstack/react-query";
import { getAllProblems, topContributers } from "../lib/axios.js";
import { useNavigate } from "react-router-dom";
import ProblemList from "../components/ProblemList";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
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
      <div className="flex h-fit  justify-center mt-20">
        <span className="loading  text-xl">Loading...</span>
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
              Retry Init Data
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
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-2 ">
      <h1 className="text-4xl font-extrabold z-10 text-center mb-6">
        Welcome to <span className="text-primary">Code Den</span>
      </h1>
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold text-white mb-4">
          🔥 Top Consistent Users
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => navigate(`/user/:${user.id}`)}
              className="bg-slate-800 cursor-pointer border border-slate-700 rounded-2xl shadow-lg p-4 flex items-center gap-4 hover:shadow-xl transition-shadow"
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-14 w-14 rounded-full object-cover border border-slate-600"
                />
              ) : (
                <img
                  src={"https://avatar.iran.liara.run/public/boy"}
                  alt={"avatar"}
                  className="h-14 w-14 rounded-full object-cover border border-slate-600"
                />
              )}
              <div className="flex flex-col items-start gap-1">
                <h3 className="text-white font-semibold text-lg">
                  {user.username.charAt(0).toUpperCase() +
                    user.username.slice(1).toLowerCase()}
                </h3>
                <p className="text-orange-400 text-sm flex items-center gap-1">
                  🔥 Max Streak:{" "}
                  <span className="font-bold">{user.streak}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        {problemLoading ? (
          <div className="flex h-fit  justify-center mt-20">
            <span className="loading  text-xl">Loading...</span>
          </div>
        ) : (
          <ProblemList
            problemList={problemList?.response}
            setFilter={setFilter}
            filter={filter}
            refetchProblems={refetchProblems}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
