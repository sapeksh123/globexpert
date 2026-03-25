import { useEffect, useState } from "react";
import DataTable from "../components/ui/DataTable";
import { useToast } from "../context/ToastContext";
import { createSellerByAdmin, fetchSellersRows, updateSellerStatus, updateUserStatus } from "../services/dashboardApi";

const columns = [
  { key: "businessName", label: "Business" },
  { key: "owner", label: "Owner" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "active", label: "Active" },
  { key: "actions", label: "Actions" },
];

const initialSellerForm = {
  name: "",
  email: "",
  password: "",
  businessName: "",
  businessDescription: "",
};

export default function SellersPage() {
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionKey, setActionKey] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [sellerForm, setSellerForm] = useState(initialSellerForm);
  const [isCreating, setIsCreating] = useState(false);
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
      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          disabled={Boolean(actionKey)}
          onClick={async () => {
            setActionKey(`approve-${row.id}`);
            try {
              await updateSellerStatus(row.id, "APPROVED");
              await reload();
              showToast("Seller approved", "success");
            } catch (err) {
              setError(err.response?.data?.message || "Failed to approve seller");
              showToast("Approve action failed", "error");
            } finally {
              setActionKey("");
            }
          }}
          className="rounded-lg border border-emerald-200 px-2 py-1 text-xs text-emerald-700"
        >
          {actionKey === `approve-${row.id}` ? "Saving..." : "Approve"}
        </button>
        <button
          type="button"
          disabled={Boolean(actionKey)}
          onClick={async () => {
            setActionKey(`reject-${row.id}`);
            try {
              await updateSellerStatus(row.id, "REJECTED");
              await reload();
              showToast("Seller rejected", "success");
            } catch (err) {
              setError(err.response?.data?.message || "Failed to reject seller");
              showToast("Reject action failed", "error");
            } finally {
              setActionKey("");
            }
          }}
          className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-700"
        >
          {actionKey === `reject-${row.id}` ? "Saving..." : "Reject"}
        </button>
        <button
          type="button"
          disabled={Boolean(actionKey)}
          onClick={async () => {
            if (!row.userId) return;
            setActionKey(`active-${row.id}`);
            try {
              await updateUserStatus(row.userId, !row.userActive);
              await reload();
              showToast(`Seller ${row.userActive ? "deactivated" : "activated"}`, "success");
            } catch (err) {
              setError(err.response?.data?.message || "Failed to update seller active status");
              showToast("Seller status update failed", "error");
            } finally {
              setActionKey("");
            }
          }}
          className={`rounded-lg border px-2 py-1 text-xs ${
            row.userActive ? "border-rose-200 text-rose-700" : "border-emerald-200 text-emerald-700"
          }`}
        >
          {actionKey === `active-${row.id}` ? "Saving..." : row.userActive ? "Deactivate" : "Activate"}
        </button>
      </div>
    ),
  }));

  const onCreateSeller = async (event) => {
    event.preventDefault();
    setError("");

    if (sellerForm.name.trim().length < 2 || sellerForm.businessName.trim().length < 2) {
      setError("Name and business name must be at least 2 characters");
      return;
    }

    if (!sellerForm.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (sellerForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsCreating(true);
    try {
      await createSellerByAdmin({
        name: sellerForm.name.trim(),
        email: sellerForm.email.trim(),
        password: sellerForm.password,
        businessName: sellerForm.businessName.trim(),
        businessDescription: sellerForm.businessDescription.trim(),
      });
      showToast("Seller created and approved", "success");
      setSellerForm(initialSellerForm);
      setIsCreateOpen(false);
      await reload();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create seller";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">Seller Approval and Monitoring</h3>
        <p className="mt-1 text-sm text-slate-600">Approve or reject seller requests and monitor onboarding health.</p>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm sm:w-auto"
          >
            <option value="">All statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="APPROVED">APPROVED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-500">Total sellers: {total}</p>
            <button
              type="button"
              onClick={() => setIsCreateOpen((prev) => !prev)}
              className="rounded-xl bg-[#0e1b32] px-3 py-2 text-xs font-medium text-white"
            >
              {isCreateOpen ? "Close" : "Create Seller"}
            </button>
          </div>
        </div>

        {isCreateOpen ? (
          <form onSubmit={onCreateSeller} className="mt-4 grid gap-2 sm:grid-cols-2">
            <input
              placeholder="Seller name"
              value={sellerForm.name}
              onChange={(event) => setSellerForm((prev) => ({ ...prev, name: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <input
              placeholder="Seller email"
              type="email"
              value={sellerForm.email}
              onChange={(event) => setSellerForm((prev) => ({ ...prev, email: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <input
              placeholder="Temporary password"
              type="password"
              value={sellerForm.password}
              onChange={(event) => setSellerForm((prev) => ({ ...prev, password: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <input
              placeholder="Business name"
              value={sellerForm.businessName}
              onChange={(event) => setSellerForm((prev) => ({ ...prev, businessName: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <textarea
              placeholder="Business description"
              value={sellerForm.businessDescription}
              onChange={(event) => setSellerForm((prev) => ({ ...prev, businessDescription: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
              rows={3}
            />
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isCreating}
                className="rounded-xl bg-[#0e1b32] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {isCreating ? "Creating..." : "Create and Approve Seller"}
              </button>
            </div>
          </form>
        ) : null}
      </div>

      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {isLoading ? <p className="text-sm text-slate-500">Loading sellers...</p> : null}
      <DataTable columns={columns} rows={tableRows} />
    </section>
  );
}
