import { useEffect, useState } from "react";
import DataTable from "../components/ui/DataTable";
import { useToast } from "../context/ToastContext";
import { fetchUsersRows, updateUserStatus } from "../services/dashboardApi";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "active", label: "Status" },
  { key: "actions", label: "Actions" },
];

export default function UsersPage() {
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");
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
        const result = await fetchUsersRows({ role, search, page: 1, limit: 10 });
        if (active) {
          setRows(result.rows);
          setTotal(result.total);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load users");
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
  }, [role, search]);

  const reload = async () => {
    const result = await fetchUsersRows({ role, search, page: 1, limit: 10 });
    setRows(result.rows);
    setTotal(result.total);
  };

  const tableRows = rows.map((row) => ({
    ...row,
    actions: (
      <button
        type="button"
        disabled={Boolean(actionKey)}
        onClick={async () => {
          setActionKey(`user-${row.id}`);
          try {
            await updateUserStatus(row.id, !row.isActive);
            await reload();
            showToast(`User ${row.isActive ? "deactivated" : "activated"}`, "success");
          } catch (err) {
            setError(err.response?.data?.message || "Failed to update user status");
            showToast("User status update failed", "error");
          } finally {
            setActionKey("");
          }
        }}
        className={`rounded-lg border px-2 py-1 text-xs ${
          row.isActive
            ? "border-rose-200 text-rose-700"
            : "border-emerald-200 text-emerald-700"
        }`}
      >
        {actionKey === `user-${row.id}` ? "Saving..." : row.isActive ? "Deactivate" : "Activate"}
      </button>
    ),
  }));

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">User and Seller Management</h3>
        <p className="mt-1 text-sm text-slate-600">Admin-only panel for monitoring platform participants.</p>
        <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2">
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">All roles</option>
              <option value="USER">USER</option>
              <option value="SELLER">SELLER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name or email"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
          <p className="text-xs text-slate-500">Total users: {total}</p>
        </div>
      </div>
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {isLoading ? <p className="text-sm text-slate-500">Loading users...</p> : null}
      <DataTable columns={columns} rows={tableRows} />
    </section>
  );
}
