import { IconContext } from "react-icons";

export default function StatCard({ title, value, hint, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>
          <h3 className="mt-2 wrap-break-word text-xl font-semibold text-slate-900 sm:text-2xl">{value}</h3>
          <p className="mt-2 text-[11px] text-teal-700 sm:text-xs">{hint}</p>
        </div>
        <IconContext.Provider value={{ className: "text-xl text-teal-700 sm:text-2xl" }}>
          <Icon />
        </IconContext.Provider>
      </div>
    </div>
  );
}
