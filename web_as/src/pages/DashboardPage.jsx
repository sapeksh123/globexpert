import { useEffect, useMemo, useState } from "react";
import { LuBox, LuDollarSign, LuPackageSearch, LuUsers } from "react-icons/lu";
import StatCard from "../components/ui/StatCard";
import { useAuth } from "../context/AuthContext";
import { fetchDashboardStats } from "../services/dashboardApi";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [statsData, setStatsData] = useState({ orders: 0, revenue: 0, catalog: 0, users: null });

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchDashboardStats(user?.role);
        if (active) {
          setStatsData(data);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load dashboard stats");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [user?.role]);

  const stats = useMemo(
    () => [
      { title: "Orders", value: String(statsData.orders), hint: "Live order count", icon: LuPackageSearch },
      {
        title: "Revenue",
        value: `$${Number(statsData.revenue || 0).toFixed(2)}`,
        hint: "Revenue API pending",
        icon: LuDollarSign,
      },
      { title: "Catalog Items", value: String(statsData.catalog), hint: "Products + services", icon: LuBox },
      {
        title: "Active Users",
        value: statsData.users == null ? "-" : String(statsData.users),
        hint: user?.role === "ADMIN" ? "Admin scope" : "Admin only metric",
        icon: LuUsers,
      },
    ],
    [statsData, user?.role]
  );

  return (
    <section className="space-y-4">
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-busy={isLoading}>
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
