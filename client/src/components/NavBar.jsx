import { useState } from "react";
import { User, Code, LogOut } from "lucide-react";
import authStore from "../store/authStore";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "../lib/axios";
import { toast } from "react-hot-toast";
const NavBar = () => {
  const { authUser, setUser } = authStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { mutate } = useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      setUser(null);
      navigate("/login", { replace: true });
    },
    onError: (error) => {
      toast.error(error.response.data.message || "Something went wrong");
    },
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900/70 backdrop-blur border-b border-slate-800 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/leetlab.svg"
            alt="Leetlab Logo"
            className="h-10 w-10 rounded-full bg-indigo-500/20 p-1"
          />
          <span className="hidden md:block text-xl font-bold text-slate-50">
            Code Den
          </span>
        </Link>

        {/* User Dropdown */}
        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-orange-500/20 px-3 py-1 rounded-xl shadow-lg border border-orange-400">
              <span className="text-orange-500 text-xl">🔥</span>
              <span className="text-orange-300 font-semibold text-lg">
                {authUser.streak}
              </span>
            </div>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center focus:outline-none cursor-pointer"
            >
              <img
                src={
                  authUser?.avatar || "https://avatar.iran.liara.run/public/boy"
                }
                alt="User Avatar"
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
                className="flex items-center gap-2 text-slate-200 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md transition-colors"
              >
                <User className="w-4 h-4" />
                My Profile
              </Link>

              {authUser?.role === "ADMIN" &&
              !pathname.includes("/add-problem") ? (
                <Link
                  to="/add-problem"
                  className="flex items-center gap-2 text-slate-200 hover:bg-indigo-500 hover:text-white px-3 py-2 rounded-md transition-colors"
                >
                  <Code className="w-4 h-4" />
                  Add Problem
                </Link>
              ) : null}

              <button
                onClick={() => mutate()}
                className="w-full text-left flex items-center gap-2 text-red-500 hover:bg-red-600 hover:text-white px-3 py-2 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
