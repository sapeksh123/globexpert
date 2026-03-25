import DataTable from "../components/ui/DataTable";

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "role", label: "Role" },
  { key: "active", label: "Status" },
];

const rows = [
  { name: "Riya Shah", email: "riya@example.com", role: "USER", active: "Active" },
  { name: "Dev Store", email: "dev@seller.com", role: "SELLER", active: "Active" },
  { name: "Admin Root", email: "admin@globexpert.com", role: "ADMIN", active: "Active" },
];

export default function UsersPage() {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">User and Seller Management</h3>
        <p className="mt-1 text-sm text-slate-600">Admin-only panel for monitoring platform participants.</p>
      </div>
      <DataTable columns={columns} rows={rows} />
    </section>
  );
}
