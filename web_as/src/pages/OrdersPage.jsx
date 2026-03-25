import DataTable from "../components/ui/DataTable";

const columns = [
  { key: "id", label: "Order ID" },
  { key: "customer", label: "Customer" },
  { key: "amount", label: "Amount" },
  { key: "status", label: "Status" },
  { key: "date", label: "Date" },
];

const rows = [
  { id: "ORD-1201", customer: "Aarav", amount: "$60", status: "CONFIRMED", date: "2026-03-21" },
  { id: "ORD-1202", customer: "Anika", amount: "$22", status: "PROCESSING", date: "2026-03-22" },
  { id: "ORD-1203", customer: "Kabir", amount: "$90", status: "DELIVERED", date: "2026-03-23" },
];

export default function OrdersPage() {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Order Management</h3>
        <p className="mt-1 text-sm text-slate-600">Track and update order status lifecycle.</p>
      </div>
      <DataTable columns={columns} rows={rows} />
    </section>
  );
}
