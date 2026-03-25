import { LuBox, LuDollarSign, LuPackageSearch, LuUsers } from "react-icons/lu";
import StatCard from "../components/ui/StatCard";

const stats = [
  { title: "Orders", value: "1,204", hint: "+12% this week", icon: LuPackageSearch },
  { title: "Revenue", value: "$48,920", hint: "+8.2% this month", icon: LuDollarSign },
  { title: "Catalog Items", value: "367", hint: "Products + services", icon: LuBox },
  { title: "Active Users", value: "2,430", hint: "Across all cities", icon: LuUsers },
];

export default function DashboardPage() {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Platform Snapshot</h3>
        <p className="mt-2 text-sm text-slate-600">
          Use this dashboard as the analytics hub for seller performance, order velocity, and platform health.
          API charts can be plugged in here in the next iteration.
        </p>
      </div>
    </section>
  );
}
