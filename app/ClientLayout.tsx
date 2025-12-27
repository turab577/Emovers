"use client";

import { SessionProvider } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if current route is an auth route
  const isAuthRoute =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/forgot-password") ||
    pathname?.startsWith("/new-password") ||
    pathname?.startsWith("/otp");

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1280px)");
    const handle = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(e.matches);
      if (e.matches) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    handle(mq);
    mq.addEventListener("change", handle);
    return () => mq.removeEventListener("change", handle);
  }, []);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const handleMinimize = () => setMinimized((prev) => !prev);

  const getMarginLeft = () => {
    if (isMobile) return "ml-0";
    if (!sidebarOpen) return "ml-0";
    if (minimized) return "ml-[72px]";
    return "ml-[260px]";
  };

  // If it's an auth route, return children without sidebar/header
  if (isAuthRoute) {
    return <SessionProvider>{children}</SessionProvider>;
  }

  // Otherwise, render with Sidebar and Header
  return (
    <SessionProvider>
      <div className="flex relative min-h-screen">
        {/* Backdrop for mobile */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleSidebar}
          />
        )}

        {/* Sidebar */}
        <div
          className={`fixed left-0 top-0 h-screen z-50 transition-transform duration-300 ${
            isMobile
              ? sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          <Sidebar
            onClose={toggleSidebar}
            isMobile={isMobile}
            minimized={minimized}
            onMinimize={handleMinimize}
          />
        </div>

        {/* Main Content */}
        <div
          className={`w-full transition-all duration-300 ${getMarginLeft()}`}
        >
          <div
            className="fixed top-0 right-0 left-0 z-30"
            style={{
              marginLeft: isMobile
                ? "0"
                : sidebarOpen
                ? minimized
                  ? "72px"
                  : "260px"
                : "0",
            }}
          >
            <Header onMenuClick={toggleSidebar} isMobile={isMobile} />
          </div>

          {/* Content with top padding to account for fixed header */}
          <div className="w-full px-2 sm:px-5 pt-[85px]">{children}</div>
        </div>
      </div>
    </SessionProvider>
  );
};

export default ClientLayout;
