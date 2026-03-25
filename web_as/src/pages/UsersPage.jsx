import { useEffect, useState } from "react";
import DataTable from "../components/ui/DataTable";
import { useToast } from "../context/ToastContext";
import { createUserByAdmin, fetchUsersRows, updateUserStatus } from "../services/dashboardApi";

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
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [isCreating, setIsCreating] = useState(false);
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

  const onCreateUser = async (event) => {
    event.preventDefault();
    setError("");

    if (newUser.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!newUser.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (newUser.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsCreating(true);
    try {
      await createUserByAdmin({
        name: newUser.name.trim(),
        email: newUser.email.trim(),
        password: newUser.password,
        phone: newUser.phone.trim(),
        address: newUser.address.trim(),
      });
      showToast("User created", "success");
      setNewUser({ name: "", email: "", password: "", phone: "", address: "" });
      setIsCreateOpen(false);
      await reload();
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create user";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">User and Seller Management</h3>
        <p className="mt-1 text-sm text-slate-600">Admin-only panel for monitoring platform participants.</p>
        <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <select
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm sm:w-auto"
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
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm sm:min-w-64"
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-slate-500">Total users: {total}</p>
            <button
              type="button"
              onClick={() => setIsCreateOpen((prev) => !prev)}
              className="rounded-xl bg-[#0e1b32] px-3 py-2 text-xs font-medium text-white"
            >
              {isCreateOpen ? "Close" : "Create User"}
            </button>
          </div>
        </div>

        {isCreateOpen ? (
          <form onSubmit={onCreateUser} className="mt-4 grid gap-2 sm:grid-cols-2">
            <input
              placeholder="Full name"
              value={newUser.name}
              onChange={(event) => setNewUser((prev) => ({ ...prev, name: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <input
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={(event) => setNewUser((prev) => ({ ...prev, email: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <input
              placeholder="Temporary password"
              type="password"
              value={newUser.password}
              onChange={(event) => setNewUser((prev) => ({ ...prev, password: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <input
              placeholder="Phone (optional)"
              value={newUser.phone}
              onChange={(event) => setNewUser((prev) => ({ ...prev, phone: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <textarea
              placeholder="Address (optional)"
              value={newUser.address}
              onChange={(event) => setNewUser((prev) => ({ ...prev, address: event.target.value }))}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm sm:col-span-2"
              rows={3}
            />
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isCreating}
                className="rounded-xl bg-[#0e1b32] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {isCreating ? "Creating..." : "Create User"}
              </button>
            </div>
          </form>
        ) : null}
      </div>
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {isLoading ? <p className="text-sm text-slate-500">Loading users...</p> : null}
      <DataTable columns={columns} rows={tableRows} />
    </section>
  );
}
