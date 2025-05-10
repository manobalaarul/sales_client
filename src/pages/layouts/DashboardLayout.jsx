import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import { MdMenu, MdNotifications, MdPerson } from "react-icons/md";
import Sidebar from "../../components/sidebar/Sidebar";
import ProtectedRoute from "./ProtectedRoute";
import Header from "../../components/header/Header";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Preloader state

  useEffect(() => {
    // Simulate loading delay (replace with actual data fetching if needed)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 h-screen overflow-auto scrollbar-none">
          {/* Header with Logo & Hamburger */}

          <Header toggleSidebar={toggleSidebar} />
          {/* Page Content */}
          <Outlet />
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardLayout;
