import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import globalStore from "./store/index.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { checkUser } from "./lib/axios.js";
import { useEffect } from "react";

function App() {
  const { authUser, setUser } = globalStore();
  const queryClient = useQueryClient();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["check-user"],
    queryFn: checkUser,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    onError: (err) => console.error("Auth check error:", err),
  });

  useEffect(() => {
    if (data?.response?.user && !authUser) {
      setUser(data.response.user);
    } else if (data?.response?.user === null) {
      setUser(null);
    }
  }, [data, authUser, setUser]);

  if (isPending) {
    return <span className="loading loading-spinner">Loading...</span>;
  }

  if (isError) {
    return (
      <p>
        {error?.message || "Something went wrong"}
        <button
          onClick={() => queryClient.invalidateQueries(["check-user"])}
          className="ml-2 text-blue-500 underline"
        >
          Retry
        </button>
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between">
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" replace /> : <Signup />}
        />
      </Routes>
    </div>
  );
}

export default App;
