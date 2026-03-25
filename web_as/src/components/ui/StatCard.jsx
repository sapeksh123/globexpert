import { IconContext } from "react-icons";

export default function StatCard({ title, value, hint, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-semibold text-slate-900">{value}</h3>
          <p className="mt-2 text-xs text-teal-700">{hint}</p>
        </div>
        <IconContext.Provider value={{ className: "text-2xl text-teal-700" }}>
          <Icon />
        </IconContext.Provider>
      </div>
    </div>
  );
}
