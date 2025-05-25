import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import globalStore from "./store/index.js";
function App() {
  const { authUser } = globalStore();
  console.log("authUser", authUser);
  return (
    <div className="flex flex-col items-center justify-between">
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} replace />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to={"/"} replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to={"/"} replace /> : <Signup />}
        />
      </Routes>
    </div>
  );
}

export default App;
