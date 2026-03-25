import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuMenu } from "react-icons/lu";
import { useAuth } from "../../context/AuthContext";

export default function Topbar({ onToggleSidebar }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");

  const initials = (user?.name || "U")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
  };

  useEffect(() => {
    // Set initially
    setGreeting(getGreeting());

    // Update every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="rounded-2xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-5 sm:py-4">
      <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="rounded-lg border border-slate-200 p-2 text-slate-600 lg:hidden"
            aria-label="Toggle sidebar"
          >
            <LuMenu />
          </button>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{greeting}</p>
            <h2 className="truncate text-base font-semibold text-slate-900 sm:text-xl">Welcome back, {user?.name}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-teal-100 px-2.5 py-1 text-[10px] font-semibold text-teal-800 sm:inline-flex sm:px-3 sm:text-xs">
            {user?.role}
          </span>
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-[#0e1b32] text-xs font-semibold text-white"
            aria-label="Open profile page"
            title="Profile"
          >
            {initials || "U"}
          </button>
        </div>
      </div>
    </header>
  );
}
