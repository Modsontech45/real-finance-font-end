import React from "react";
import { Outlet } from "react-router-dom";
import { useAppearance } from "../../contexts/AppearanceContext";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const Layout: React.FC = () => {
  const { isDarkMode } = useAppearance();

  return (
    <div
      className={`flex flex-col lg:flex-row min-h-screen ${
        isDarkMode
          ? "bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50"
      }`}
    >
      <Sidebar />
     <main className="flex-1 flex flex-col overflow-auto lg:ml-64">
  <div className="flex-1">
    <Outlet />
  </div>
  <Footer />
</main>

    </div>
  );
};

export default Layout;
