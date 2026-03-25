import { useEffect, useMemo, useState } from "react";
import { LuBox, LuDollarSign, LuPackageSearch, LuWrench } from "react-icons/lu";
import StatCard from "../components/ui/StatCard";
import { useAuth } from "../context/AuthContext";
import { fetchSellerDashboardAnalytics } from "../services/dashboardApi";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [statsData, setStatsData] = useState({
    kpis: {
      totalOrders: 0,
      totalRevenue: 0,
      totalProducts: 0,
      totalServices: 0,
    },
    statusBreakdown: {
      CONFIRMED: 0,
      PROCESSING: 0,
      DELIVERED: 0,
    },
    trendByDay: [],
  });

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await fetchSellerDashboardAnalytics({
          userId: user?._id,
          status,
          fromDate,
          toDate,
        });
        if (active) {
          setStatsData(data);
        }
      } catch (err) {
        if (active) {
          setError(err.normalizedMessage || err.response?.data?.message || "Failed to load dashboard stats");
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
  }, [user?._id, status, fromDate, toDate]);

  const maxOrders = Math.max(...statsData.trendByDay.map((item) => item.orders), 1);
  const maxRevenue = Math.max(...statsData.trendByDay.map((item) => item.revenue), 1);

  const stats = useMemo(
    () => [
      {
        title: "Orders",
        value: String(statsData.kpis.totalOrders),
        hint: "Filtered orders",
        icon: LuPackageSearch,
      },
      {
        title: "Revenue",
        value: `Rs. ${Number(statsData.kpis.totalRevenue || 0).toFixed(2)}`,
        hint: "Filtered revenue",
        icon: LuDollarSign,
      },
      {
        title: "Products",
        value: String(statsData.kpis.totalProducts),
        hint: "Seller products",
        icon: LuBox,
      },
      {
        title: "Services",
        value: String(statsData.kpis.totalServices),
        hint: "Seller services",
        icon: LuWrench,
      },
    ],
    [statsData]
  );

  return (
    <section className="space-y-4">
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>

          <input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />

          <input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />

          <button
            type="button"
            onClick={() => {
              setStatus("");
              setFromDate("");
              setToDate("");
            }}
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-busy={isLoading}>
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Order Status Analytics</h3>
          <div className="mt-4 space-y-3 text-sm">
            {[
              ["CONFIRMED", statsData.statusBreakdown.CONFIRMED],
              ["PROCESSING", statsData.statusBreakdown.PROCESSING],
              ["DELIVERED", statsData.statusBreakdown.DELIVERED],
            ].map(([label, value]) => {
              const total = Math.max(statsData.kpis.totalOrders, 1);
              const width = Math.round((Number(value) / total) * 100);
              return (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-slate-600">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-teal-500" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Orders and Revenue Trend</h3>
          <div className="mt-4 space-y-3">
            {statsData.trendByDay.length === 0 ? (
              <p className="text-sm text-slate-500">No data available for selected filters.</p>
            ) : (
              statsData.trendByDay.map((row) => (
                <div key={row.date} className="space-y-1">
                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs text-slate-500">
                    <span>{row.date}</span>
                    <span>
                      {row.orders} orders | Rs. {row.revenue.toFixed(2)}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-indigo-500"
                      style={{ width: `${Math.max((row.orders / maxOrders) * 100, 2)}%` }}
                    />
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${Math.max((row.revenue / maxRevenue) * 100, 2)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
