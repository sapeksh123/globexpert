import { useEffect, useMemo, useState } from "react";
import { LuBox, LuCheckCheck, LuClock3, LuDollarSign, LuPackageSearch, LuUsers, LuWrench } from "react-icons/lu";
import StatCard from "../components/ui/StatCard";
import { useAuth } from "../context/AuthContext";
import { fetchAdminDashboardAnalytics, fetchSellerDashboardAnalytics } from "../services/dashboardApi";

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
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
    orderStatusBreakdown: {
      CONFIRMED: 0,
      PROCESSING: 0,
      DELIVERED: 0,
    },
  });

  const trendByDay = statsData.trendByDay || [];
  const statusBreakdown = statsData.statusBreakdown || statsData.orderStatusBreakdown || {
    CONFIRMED: 0,
    PROCESSING: 0,
    DELIVERED: 0,
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = isAdmin
          ? await fetchAdminDashboardAnalytics()
          : await fetchSellerDashboardAnalytics({
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
  }, [isAdmin, user?._id, status, fromDate, toDate]);

  const maxOrders = trendByDay.length > 0 ? Math.max(...trendByDay.map((item) => item.orders), 1) : 1;
  const maxRevenue = trendByDay.length > 0 ? Math.max(...trendByDay.map((item) => item.revenue), 1) : 1;

  const sellerStats = useMemo(
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

  const adminStats = useMemo(
    () => [
      {
        title: "Total Users",
        value: String(statsData.kpis.totalUsers || 0),
        hint: "All customers and panel users",
        icon: LuUsers,
      },
      {
        title: "Pending Sellers",
        value: String(statsData.kpis.pendingSellers || 0),
        hint: "Need admin review",
        icon: LuClock3,
      },
      {
        title: "Approved Sellers",
        value: String(statsData.kpis.approvedSellers || 0),
        hint: "Can access seller panel",
        icon: LuCheckCheck,
      },
      {
        title: "Total Orders",
        value: String(statsData.kpis.totalOrders || 0),
        hint: "Platform orders",
        icon: LuPackageSearch,
      },
    ],
    [statsData]
  );

  const renderAdminDashboard = () => {
    const userTotal = Math.max(Number(statsData.kpis.totalUsers || 0), 1);
    const activeWidth = Math.round((Number(statsData.kpis.activeUsers || 0) / userTotal) * 100);
    const inactiveWidth = Math.round((Number(statsData.kpis.inactiveUsers || 0) / userTotal) * 100);
    const sellerTotal = Math.max(Number(statsData.kpis.totalSellers || 0), 1);

    return (
      <>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" aria-busy={isLoading}>
          {adminStats.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Seller Approval Pipeline</h3>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["PENDING", Number(statsData.kpis.pendingSellers || 0)],
                ["APPROVED", Number(statsData.kpis.approvedSellers || 0)],
                ["REJECTED", Number(statsData.kpis.rejectedSellers || 0)],
              ].map(([label, value]) => {
                const width = Math.round((value / sellerTotal) * 100);
                return (
                  <div key={label}>
                    <div className="mb-1 flex items-center justify-between text-slate-600">
                      <span>{label}</span>
                      <span>{value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-base font-semibold text-slate-900 sm:text-lg">User Activation Overview</h3>
            <div className="mt-4 space-y-3 text-sm">
              {[
                ["ACTIVE", Number(statsData.kpis.activeUsers || 0), activeWidth],
                ["INACTIVE", Number(statsData.kpis.inactiveUsers || 0), inactiveWidth],
              ].map(([label, value, width]) => (
                <div key={label}>
                  <div className="mb-1 flex items-center justify-between text-slate-600">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${width}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Catalog Capacity</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Products</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{statsData.kpis.totalProducts || 0}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Services</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{statsData.kpis.totalServices || 0}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Sellers</p>
              <p className="mt-1 text-xl font-semibold text-slate-900">{statsData.kpis.totalSellers || 0}</p>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderSellerDashboard = () => (
    <>
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
        {sellerStats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Order Status Analytics</h3>
          <div className="mt-4 space-y-3 text-sm">
            {[
              ["CONFIRMED", statusBreakdown.CONFIRMED],
              ["PROCESSING", statusBreakdown.PROCESSING],
              ["DELIVERED", statusBreakdown.DELIVERED],
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
            {trendByDay.length === 0 ? (
              <p className="text-sm text-slate-500">No data available for selected filters.</p>
            ) : (
              trendByDay.map((row) => (
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
    </>
  );

  return (
    <section className="space-y-4">
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}

      {isAdmin ? renderAdminDashboard() : renderSellerDashboard()}
    </section>
  );
}
