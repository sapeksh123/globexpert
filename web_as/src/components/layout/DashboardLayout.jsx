import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#d7f6f1,#f8fafc_45%)]">
      <div className="mx-auto grid min-h-screen max-w-350 grid-cols-1 lg:grid-cols-[288px_1fr]">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        <main className="p-4 sm:p-5 lg:p-8">
          <Topbar onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)} />
          <div className="mt-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
