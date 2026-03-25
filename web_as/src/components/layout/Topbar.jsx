import { useAuth } from "../../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Role based panel</p>
          <h2 className="text-xl font-semibold text-slate-900">Welcome back, {user?.name}</h2>
        </div>
        <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
          {user?.role}
        </span>
      </div>
    </header>
  );
}
