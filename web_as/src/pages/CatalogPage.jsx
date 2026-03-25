import { useEffect, useState } from "react";
import DataTable from "../components/ui/DataTable";
import { useToast } from "../context/ToastContext";
import { createCatalogItem, deleteCatalogItem, fetchCatalogRows, updateCatalogItem } from "../services/dashboardApi";

const columns = [
  { key: "image", label: "Image" },
  { key: "title", label: "Title" },
  { key: "type", label: "Type" },
  { key: "category", label: "Category" },
  { key: "description", label: "Description" },
  { key: "extra", label: "Details" },
  { key: "price", label: "Price" },
  { key: "status", label: "Status" },
];

const emptyForm = {
  id: "",
  title: "",
  type: "PRODUCT",
  category: "",
  description: "",
  price: "",
  stock: "0",
  durationMinutes: "30",
  imageFile: null,
};

function CatalogItemDialog({
  mode,
  value,
  onChange,
  onClose,
  onSubmit,
  isSubmitting,
}) {
  const isEdit = mode === "edit";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {isEdit ? "Edit Catalog Item" : "Add Catalog Item"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600"
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Item Title</p>
            <input
              value={value.title}
              onChange={(event) => onChange("title", event.target.value)}
              placeholder="Enter item title"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Item Type</p>
            <select
              value={value.type}
              onChange={(event) => onChange("type", event.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              disabled={isEdit}
            >
              <option value="PRODUCT">PRODUCT</option>
              <option value="SERVICE">SERVICE</option>
            </select>
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Category</p>
            <input
              value={value.category}
              onChange={(event) => onChange("category", event.target.value)}
              placeholder="Enter category"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Price</p>
            <input
              value={value.price}
              onChange={(event) => onChange("price", event.target.value)}
              placeholder="Enter price"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              type="number"
              min="0"
              step="0.01"
              required
            />
          </div>

          {value.type === "PRODUCT" ? (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Stock Quantity</p>
              <input
                value={value.stock}
                onChange={(event) => onChange("stock", event.target.value)}
                placeholder="Enter stock quantity"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                type="number"
                min="0"
                required
              />
            </div>
          ) : (
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Duration (Minutes)</p>
              <input
                value={value.durationMinutes}
                onChange={(event) => onChange("durationMinutes", event.target.value)}
                placeholder="Enter duration in minutes"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                type="number"
                min="1"
                required
              />
            </div>
          )}

          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Item Image</p>
            <input
              onChange={(event) => onChange("imageFile", event.target.files?.[0] || null)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              type="file"
              accept="image/*"
            />
          </div>

          <div className="md:col-span-2">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
            <textarea
              value={value.description}
              onChange={(event) => onChange("description", event.target.value)}
              placeholder="Enter item description"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              rows={4}
            />
          </div>

          <div className="flex gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#0e1b32] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Add Item"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogMode, setDialogMode] = useState("closed");
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionKey, setActionKey] = useState("");
  const [previewItem, setPreviewItem] = useState(null);
  const { showToast } = useToast();

  const loadRows = async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await fetchCatalogRows({
        search: query,
        page,
        limit: 20,
        category: categoryFilter,
        status: statusFilter === "ALL" ? "" : statusFilter,
      });
      setRows(result.rows);
      setTotal(result.total);
    } catch (err) {
      setError(err.normalizedMessage || err.response?.data?.message || "Failed to load catalog");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const result = await fetchCatalogRows({
          search: query,
          page,
          limit: 20,
          category: categoryFilter,
          status: statusFilter === "ALL" ? "" : statusFilter,
        });
        if (active) {
          setRows(result.rows);
          setTotal(result.total);
        }
      } catch (err) {
        if (active) {
          setError(err.normalizedMessage || err.response?.data?.message || "Failed to load catalog");
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
  }, [query, page, categoryFilter, statusFilter]);

  const filteredRows = rows.filter((row) => {
    if (typeFilter === "ALL") return true;
    return row.type === typeFilter;
  });

  const tableRows = filteredRows.map((row) => ({
    ...row,
    image: row.imageUrl ? (
      <img
        src={row.imageUrl}
        alt={row.title}
        className="h-12 w-12 rounded-lg border border-slate-200 object-cover"
      />
    ) : (
      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-dashed border-slate-300 text-[10px] text-slate-500">
        No image
      </div>
    ),
    description: row.description ? (
      <p className="max-w-60 truncate text-xs text-slate-600" title={row.description}>
        {row.description}
      </p>
    ) : (
      <span className="text-xs text-slate-400">No description</span>
    ),
    extra:
      row.type === "PRODUCT"
        ? `Stock: ${row.stockValue}`
        : `Duration: ${row.durationMinutes || 30} min`,
    actions: (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            if (row.imageUrl) {
              setPreviewItem({ imageUrl: row.imageUrl, title: row.title });
            }
          }}
          disabled={!row.imageUrl}
          className="rounded-lg border border-indigo-200 px-2 py-1 text-xs text-indigo-700 disabled:opacity-50"
        >
          View
        </button>
        <button
          type="button"
          disabled={Boolean(actionKey)}
          onClick={async () => {
            setActionKey(`delete-${row.id}`);
            try {
              await deleteCatalogItem({ type: row.type, id: row.id });
              await loadRows();
              showToast("Catalog item deleted", "success");
            } catch (err) {
              setError(err.normalizedMessage || err.response?.data?.message || "Failed to delete item");
              showToast("Delete action failed", "error");
            } finally {
              setActionKey("");
            }
          }}
          className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-700"
        >
          {actionKey === `delete-${row.id}` ? "Deleting..." : "Delete"}
        </button>
        <button
          type="button"
          disabled={Boolean(actionKey)}
          onClick={() => {
            setForm({
              id: row.id,
              title: row.title,
              type: row.type,
              category: row.category,
              description: row.description ?? "",
              price: String(row.priceValue),
              stock: String(row.stockValue ?? 0),
              durationMinutes: String(row.durationMinutes || 30),
              imageFile: null,
            });
            setDialogMode("edit");
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

    if (!form.title.trim() || !form.category.trim() || Number(form.price) < 0) {
      setError("Please fill valid title, category, and price");
      showToast("Please fill all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await createCatalogItem(form);
      setForm(emptyForm);
      setDialogMode("closed");
      await loadRows();
      showToast("Catalog item added", "success");
    } catch (err) {
      setError(err.normalizedMessage || err.response?.data?.message || "Failed to create catalog item");
      showToast("Create action failed", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onUpdate = async (event) => {
    event.preventDefault();
    if (!form.id) return;

    if (!form.title.trim() || !form.category.trim() || Number(form.price) < 0) {
      setError("Please fill valid title, category, and price");
      showToast("Please fill all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await updateCatalogItem(form);
      setDialogMode("closed");
      setForm(emptyForm);
      await loadRows();
      showToast("Catalog item updated", "success");
    } catch (err) {
      setError(err.normalizedMessage || err.response?.data?.message || "Failed to update catalog item");
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
          View all catalog items with search and filters. Add or edit items in a focused popup form.
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-5">
          <input
            value={query}
            onChange={(event) => {
              setPage(1);
              setQuery(event.target.value);
            }}
            placeholder="Search title/category"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none md:col-span-2"
          />

          <input
            value={categoryFilter}
            onChange={(event) => {
              setPage(1);
              setCategoryFilter(event.target.value);
            }}
            placeholder="Filter category"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="ALL">All Types</option>
            <option value="PRODUCT">PRODUCT</option>
            <option value="SERVICE">SERVICE</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setPage(1);
              setStatusFilter(event.target.value);
            }}
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-slate-500">Total items: {total}</p>
          <button
            type="button"
            onClick={() => {
              setDialogMode("create");
              setForm(emptyForm);
            }}
            className="rounded-xl bg-[#0e1b32] px-4 py-2 text-sm font-medium text-white"
          >
            Add Item
          </button>
        </div>
      </div>

      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {isLoading ? <p className="text-sm text-slate-500">Loading catalog...</p> : null}
      <DataTable columns={columnsWithAction} rows={tableRows} />

      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page <= 1}
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

      {dialogMode !== "closed" ? (
        <CatalogItemDialog
          mode={dialogMode}
          value={form}
          onChange={(key, val) => setForm((prev) => ({ ...prev, [key]: val }))}
          onClose={() => {
            if (isSubmitting) return;
            setDialogMode("closed");
            setForm(emptyForm);
          }}
          onSubmit={dialogMode === "create" ? onCreate : onUpdate}
          isSubmitting={isSubmitting}
        />
      ) : null}

      {previewItem ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-base font-semibold text-slate-900">{previewItem.title} Image Preview</h4>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600"
              >
                Close
              </button>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
              <img
                src={previewItem.imageUrl}
                alt={previewItem.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
