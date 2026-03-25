import { useEffect, useState } from "react";
import DataTable from "../components/ui/DataTable";
import { useToast } from "../context/ToastContext";
import { fetchOrderRows, updateOrderStatus } from "../services/dashboardApi";

const columns = [
  { key: "id", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "date", label: "Date" },
  { key: "actions", label: "Actions" },
];

export default function OrdersPage() {
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionKey, setActionKey] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const result = await fetchOrderRows({ status, page: 1, limit: 10 });
        if (active) {
          setRows(result.rows);
          setTotal(result.total);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load orders");
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
  }, [status]);

  const tableRows = rows.map((row) => ({
    ...row,
    actions: (
      <div className="flex gap-1">
        {row.status !== "PROCESSING" ? (
          <button
            type="button"
            disabled={Boolean(actionKey)}
            onClick={async () => {
              setActionKey(`processing-${row.id}`);
              try {
                await updateOrderStatus(row.id, "PROCESSING");
                const result = await fetchOrderRows({ status, page: 1, limit: 10 });
                setRows(result.rows);
                setTotal(result.total);
                showToast("Order moved to PROCESSING", "success");
              } catch (err) {
                setError(err.response?.data?.message || "Status update failed");
                showToast("Status update failed", "error");
              } finally {
                setActionKey("");
              }
            }}
            className="rounded-lg border border-amber-200 px-2 py-1 text-xs text-amber-700"
          >
            {actionKey === `processing-${row.id}` ? "Updating..." : "Mark Processing"}
          </button>
        ) : null}
        {row.status !== "DELIVERED" ? (
          <button
            type="button"
            disabled={Boolean(actionKey)}
            onClick={async () => {
              setActionKey(`delivered-${row.id}`);
              try {
                await updateOrderStatus(row.id, "DELIVERED");
                const result = await fetchOrderRows({ status, page: 1, limit: 10 });
                setRows(result.rows);
                setTotal(result.total);
                showToast("Order moved to DELIVERED", "success");
              } catch (err) {
                setError(err.response?.data?.message || "Status update failed");
                showToast("Status update failed", "error");
              } finally {
                setActionKey("");
              }
            }}
            className="rounded-lg border border-emerald-200 px-2 py-1 text-xs text-emerald-700"
          >
            {actionKey === `delivered-${row.id}` ? "Updating..." : "Mark Delivered"}
          </button>
        ) : null}
      </div>
    ),
  }));

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Order Management</h3>
        <p className="mt-1 text-sm text-slate-600">Track and update order status lifecycle.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm sm:w-auto"
          >
            <option value="">All statuses</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="DELIVERED">DELIVERED</option>
          </select>
          <p className="text-xs text-slate-500">Total orders: {total}</p>
        </div>
      </div>
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {isLoading ? <p className="text-sm text-slate-500">Loading orders...</p> : null}
      <DataTable columns={columns} rows={tableRows} />
    </section>
  );
}
