import { Outlet } from "react-router-dom";
import NavBar from "./components/NavBar";
const Layout = () => {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <NavBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
