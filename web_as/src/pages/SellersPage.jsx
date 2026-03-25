import { useEffect, useState } from "react";
import DataTable from "../components/ui/DataTable";
import { useToast } from "../context/ToastContext";
import { fetchSellersRows, updateSellerStatus } from "../services/dashboardApi";

const columns = [
  { key: "businessName", label: "Business" },
  { key: "owner", label: "Owner" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export default function SellersPage() {
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError("");
      try {
        const result = await fetchSellersRows({ status });
        if (active) {
          setRows(result.rows);
          setTotal(result.total);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load sellers");
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

  const reload = async () => {
    const result = await fetchSellersRows({ status });
    setRows(result.rows);
    setTotal(result.total);
  };

  const tableRows = rows.map((row) => ({
    ...row,
    actions: (
      <div className="flex gap-1">
        <button
          type="button"
          onClick={async () => {
            try {
              await updateSellerStatus(row.id, "APPROVED");
              await reload();
              showToast("Seller approved", "success");
            } catch (err) {
              setError(err.response?.data?.message || "Failed to approve seller");
              showToast("Approve action failed", "error");
            }
          }}
          className="rounded-lg border border-emerald-200 px-2 py-1 text-xs text-emerald-700"
        >
          Approve
        </button>
        <button
          type="button"
          onClick={async () => {
            try {
              await updateSellerStatus(row.id, "REJECTED");
              await reload();
              showToast("Seller rejected", "success");
            } catch (err) {
              setError(err.response?.data?.message || "Failed to reject seller");
              showToast("Reject action failed", "error");
            }
          }}
          className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-700"
        >
          Reject
        </button>
      </div>
    ),
  }));

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Seller Approval and Monitoring</h3>
        <p className="mt-1 text-sm text-slate-600">Approve or reject seller requests and monitor onboarding health.</p>
        <div className="mt-4 flex items-center justify-between">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="">All statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <p className="text-xs text-slate-500">Total sellers: {total}</p>
        </div>
      </div>

      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {isLoading ? <p className="text-sm text-slate-500">Loading sellers...</p> : null}
      <DataTable columns={columns} rows={tableRows} />
    </section>
  );
}
