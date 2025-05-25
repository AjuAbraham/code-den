import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
function App() {
  const authUser = false;
  return (
    <div className="flex flex-col items-center justify-between">
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
