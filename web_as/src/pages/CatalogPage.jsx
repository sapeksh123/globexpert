import { useEffect, useState } from "react";
import DataTable from "../components/ui/DataTable";
import { useToast } from "../context/ToastContext";
import { createCatalogItem, deleteCatalogItem, fetchCatalogRows, updateCatalogItem } from "../services/dashboardApi";

const columns = [
  { key: "title", label: "Title" },
  { key: "type", label: "Type" },
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
];

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ title: "", type: "PRODUCT", category: "", price: "", stock: "0" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const loadRows = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await fetchCatalogRows({ search: query, page, limit: 10 });
      setRows(result.rows);
      setTotal(result.total);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load catalog");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const result = await fetchCatalogRows({ search: query, page, limit: 10 });
        if (active) {
          setRows(result.rows);
          setTotal(result.total);
        }
      } catch (err) {
        if (active) {
          setError(err.response?.data?.message || "Failed to load catalog");
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
  }, [query, page]);

  const tableRows = rows.map((row) => ({
    ...row,
    actions: (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={async () => {
            try {
              await deleteCatalogItem({ type: row.type, id: row.id });
              await loadRows();
              showToast("Catalog item deleted", "success");
            } catch (err) {
              setError(err.response?.data?.message || "Failed to delete item");
              showToast("Delete action failed", "error");
            }
          }}
          className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-700"
        >
          Delete
        </button>
        <button
          type="button"
          onClick={() => {
            setEditingItem({
              id: row.id,
              title: row.title,
              type: row.type,
              category: row.category,
              price: String(row.priceValue),
              stock: String(row.stockValue ?? 0),
            });
          }}
          className="rounded-lg border border-sky-200 px-2 py-1 text-xs text-sky-700"
        >
          Edit
        </button>
      </div>
    ),
  }));

  const columnsWithAction = [...columns, { key: "actions", label: "Actions" }];

  const onCreate = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      await createCatalogItem(form);
      setForm({ title: "", type: "PRODUCT", category: "", price: "", stock: "0" });
      await loadRows();
      showToast("Catalog item added", "success");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create catalog item");
      showToast("Create action failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdate = async (event) => {
    event.preventDefault();
    if (!editingItem) return;

    setIsSubmitting(true);
    setError("");
    try {
      await updateCatalogItem(editingItem);
      setEditingItem(null);
      await loadRows();
      showToast("Catalog item updated", "success");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update catalog item");
      showToast("Update action failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Catalog Management</h3>
        <p className="mt-1 text-sm text-slate-600">
          Unified table for products and services with filter and pagination extension points.
        </p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <input
            value={query}
            onChange={(event) => {
              setPage(1);
              setQuery(event.target.value);
            }}
            placeholder="Search title/category"
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none md:max-w-sm"
          />
          <p className="text-xs text-slate-500">Total items: {total}</p>
        </div>

        <form onSubmit={onCreate} className="mt-4 grid gap-2 md:grid-cols-6">
          <input
            value={form.title}
            onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            placeholder="Title"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
          <select
            value={form.type}
            onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value }))}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="PRODUCT">PRODUCT</option>
            <option value="SERVICE">SERVICE</option>
          </select>
          <input
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            placeholder="Category"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
          <input
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
            placeholder="Price"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            type="number"
            min="0"
            step="0.01"
            required
          />
          <input
            value={form.stock}
            onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
            placeholder="Stock"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            type="number"
            min="0"
            disabled={form.type === "SERVICE"}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-[#0e1b32] px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </form>

        {editingItem ? (
          <form onSubmit={onUpdate} className="mt-3 grid gap-2 rounded-xl border border-sky-100 bg-sky-50 p-3 md:grid-cols-6">
            <input
              value={editingItem.title}
              onChange={(event) => setEditingItem((prev) => ({ ...prev, title: event.target.value }))}
              placeholder="Title"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <input
              value={editingItem.category}
              onChange={(event) => setEditingItem((prev) => ({ ...prev, category: event.target.value }))}
              placeholder="Category"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
            <input
              value={editingItem.price}
              onChange={(event) => setEditingItem((prev) => ({ ...prev, price: event.target.value }))}
              placeholder="Price"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              type="number"
              min="0"
              step="0.01"
              required
            />
            <input
              value={editingItem.stock}
              onChange={(event) => setEditingItem((prev) => ({ ...prev, stock: event.target.value }))}
              placeholder="Stock"
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              type="number"
              min="0"
              disabled={editingItem.type === "SERVICE"}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-sky-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              Cancel
            </button>
          </form>
        ) : null}
      </div>

      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {isLoading ? <p className="text-sm text-slate-500">Loading catalog...</p> : null}
      <DataTable columns={columnsWithAction} rows={tableRows} />

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm"
        >
          Previous
        </button>
        <span className="text-sm text-slate-600">Page {page}</span>
        <button
          type="button"
          onClick={() => setPage((prev) => prev + 1)}
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm"
        >
          Next
        </button>
      </div>
    </section>
  );
}
