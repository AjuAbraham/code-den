import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import authStore from "./store/authStore.js";
import Layout from "./Layout.jsx";
import AddProblem from "./components/AddProblem.jsx";
import Problem from "./pages/Problem.jsx";
import CreateSolution from "./pages/CreateSolution.jsx";
function App() {
  const { authUser } = authStore();
  const isAdmin = authUser?.role === "ADMIN";
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
            path="/solution/create/:id"
            element={authUser ? <CreateSolution /> : <Navigate to={"/login"} />}
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
