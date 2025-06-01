import { LogOut, Play, User } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import authStore from "../store/authStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getOneProblem, logoutUser } from "../lib/axios";
import { useState } from "react";
import { toast } from "react-hot-toast";
import ProblemSideBar from "../components/ProblemSideBar";
import CodeEditor from "../components/CodeEditor";

const Problem = () => {
  const navigate = useNavigate();
  const { authUser, setUser } = authStore();
  const [activeTab, setActiveTab] = useState("description");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { id } = useParams();
  const { mutate } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setUser(null);
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Something went wrong");
    },
  });
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["getAllProblem", id],
    queryFn: () => getOneProblem(id),
    staleTime: 1000 * 60 * 5,
  });
  if (isLoading) {
    return (
      <div className="flex h-fit  justify-center mt-20">
        <span className="loading  text-xl">Loading...</span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center mt-20 gap-4 text-center">
        <p className="text-red-400 text-xl font-semibold">
          🚨 Oops! Something went wrong while loading data.
        </p>

        <button
          onClick={() => refetch()}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          Retry Init Data
        </button>
      </div>
    );
  }
  const problem = data?.response || {};

  return (
    <div className="w-full min-h-screen flex flex-col gap-10">
      <div>
        <nav className="w-full bg-slate-900 border-b border-slate-700 px-6 py-3 flex justify-between items-center shadow-sm z-50">
          <div className="flex items-center gap-6">
            <Link
              to="/"
              className="text-white font-semibold text-lg hover:text-orange-400 transition"
            >
              Problems
            </Link>
          </div>

          {/* Center: Run & Submit */}
          <div className="flex items-center gap-4">
            <button className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow">
              <Play className="w-4 h-4" />
              Run
            </button>
            <button className="px-4 py-2 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow">
              Submit
            </button>
          </div>

          {/* Right: Streak + Avatar + Dropdown */}
          <div className="relative">
            <div className="flex items-center gap-4">
              {/* Streak */}
              <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-xl shadow border border-orange-400">
                <span className="text-orange-500 text-xl">🔥</span>
                <span className="text-orange-300 font-semibold text-lg">
                  {authUser.streak}
                </span>
              </div>
              {/* Avatar */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="focus:outline-none cursor-pointer"
              >
                <img
                  src={
                    authUser?.avatar ||
                    "https://avatar.iran.liara.run/public/boy"
                  }
                  alt="User"
                  className="h-10 w-10 rounded-full object-cover border border-slate-700"
                />
              </button>
            </div>

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-3 w-56 rounded-xl bg-slate-800 shadow-xl ring-1 ring-black/10 p-3 space-y-2 animate-fade-in-up"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="text-sm font-semibold text-slate-100 border-b border-slate-700 pb-2">
                  {authUser?.username || "Guest"}
                </div>
                <Link
                  to="/profile"
                  className="flex cursor-pointer items-center gap-2 text-slate-200 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md transition-colors"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <button
                  onClick={() => mutate()}
                  className="w-full cursor-pointer text-left flex items-center gap-2 text-red-500 hover:bg-red-600 hover:text-white px-3 py-2 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>

        <div className="w-full px-4 py-6 flex items-start gap-2">
          <ProblemSideBar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            problem={problem}
          />
          <CodeEditor problem={problem} />
        </div>
      </div>
    </div>
  );
};

export default Problem;
