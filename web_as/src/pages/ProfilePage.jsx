import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const toInput = (user) => ({
  name: user?.name || "",
  email: user?.email || "",
  phone: user?.phone || "",
  address: user?.address || "",
});

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(() => toInput(user));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm(toInput(user));
  }, [user]);

  const hasChanges = useMemo(() => {
    const baseline = toInput(user);
    return (
      baseline.name !== form.name ||
      baseline.email !== form.email ||
      baseline.phone !== form.phone ||
      baseline.address !== form.address
    );
  }, [form, user]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });
      showToast("Profile updated successfully", "success");
    } catch (err) {
      const message = err.normalizedMessage || err.response?.data?.message || "Failed to update profile";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-base font-semibold text-slate-900 sm:text-lg">My Profile</h3>
        <p className="mt-1 text-sm text-slate-600">View and update your account details.</p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Full Name</span>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              required
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</span>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Enter phone number"
            />
          </label>

          <label className="space-y-1 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address</span>
            <textarea
              name="address"
              value={form.address}
              onChange={onChange}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              placeholder="Enter your address"
            />
          </label>

          <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <p>
              <span className="font-semibold text-slate-700">Role:</span> {user?.role}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-slate-700">Account Status:</span> {user?.isActive ? "Active" : "Inactive"}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
            <p>
              <span className="font-semibold text-slate-700">Created:</span>{" "}
              {user?.createdAt ? new Date(user.createdAt).toLocaleString() : "-"}
            </p>
            <p className="mt-1">
              <span className="font-semibold text-slate-700">Last Updated:</span>{" "}
              {user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : "-"}
            </p>
          </div>
        </div>

        {error ? <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          <button
            type="button"
            onClick={() => setForm(toInput(user))}
            disabled={isSubmitting || !hasChanges}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 disabled:opacity-50"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !hasChanges}
            className="rounded-xl bg-[#0e1b32] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </section>
  );
}
