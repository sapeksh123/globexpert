import DataTable from "../components/ui/DataTable";

const columns = [
  { key: "title", label: "Title" },
  { key: "type", label: "Type" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
];

const rows = [
  { title: "AC Cleaning", type: "SERVICE", category: "Home Care", price: "$39", status: "Active" },
  { title: "Bluetooth Speaker", type: "PRODUCT", category: "Electronics", price: "$59", status: "Active" },
  { title: "Hair Styling", type: "SERVICE", category: "Salon", price: "$22", status: "Draft" },
];

export default function CatalogPage() {
  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Catalog Management</h3>
        <p className="mt-1 text-sm text-slate-600">
          Unified table for products and services with filter and pagination extension points.
        </p>
      </div>
      <DataTable columns={columns} rows={rows} />
    </section>
  );
}
