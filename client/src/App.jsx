import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import authStore from "./store/authStore.js";
import Layout from "./Layout.jsx";
import AddProblem from "./components/AddProblem.jsx";
import Problem from "./pages/Problem.jsx";
import CreateSolution from "./pages/CreateSolution.jsx";
import Sheets from "./pages/Sheets.jsx";
import SheetPage from "./components/SheetPage.jsx";
import EditProblem from "./components/EditProblem.jsx";
import Profile from "./pages/Profile.jsx";
import { useEffect, useState } from "react";
import { isUserPresent } from "../src/lib/axios.js";
function App() {
  const [loading, setLoading] = useState(true);
  const { authUser, setUser } = authStore();
  const isAdmin = authUser?.role === "ADMIN";

  const location = useLocation();
  useEffect(() => {
    const verifyUser = async () => {
      try {
        const data = await isUserPresent();
        setUser(data.response.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyUser();
  }, [setUser, location.pathname]);
  if (loading) {
    return (
      <div className="flex h-screen justify-center items-center">
        <span className="loading text-xl">Loading...</span>
      </div>
    );
  }
  return (
    <div className="h-screen w-full flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={authUser ? <Home /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/add-problem"
            element={isAdmin ? <AddProblem /> : <Navigate to={"/"} />}
          />
          <Route
            path="/edit/:id"
            element={isAdmin ? <EditProblem /> : <Navigate to={"/"} />}
          />
          <Route
            path="/solution/create/:id"
            element={authUser ? <CreateSolution /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/sheets"
            element={authUser ? <Sheets /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/sheets/:playlistId"
            element={authUser ? <SheetPage /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to={"/login"} />}
          />
          <Route
            path="/user/:id"
            element={authUser ? <Profile /> : <Navigate to={"/login"} />}
          />
        </Route>
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to={"/"} />}
        />

        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to={"/"} />}
        />
        <Route
          path="/problem/:id"
          element={authUser ? <Problem /> : <Navigate to={"/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
