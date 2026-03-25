import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { registerSellerFromWeb } from "../services/dashboardApi";

const initialForm = {
  name: "",
  email: "",
  password: "",
  businessName: "",
  businessDescription: "",
};

export default function RegisterSellerPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Name must be at least 2 characters");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.businessName.trim().length < 2) {
      setError("Business name must be at least 2 characters");
      return;
    }

    setIsLoading(true);
    try {
      await registerSellerFromWeb({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        businessName: form.businessName.trim(),
        businessDescription: form.businessDescription.trim(),
      });

      showToast("Seller registration submitted. Please wait for admin approval.", "success");
      setForm(initialForm);
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message || err?.normalizedMessage || "Registration failed";
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[conic-gradient(at_bottom_left,#0e1b32,#16325f,#1f8a70,#f4e7d2)] p-3 sm:p-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-lg rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl sm:p-8"
      >
        <p className="text-xs uppercase tracking-[0.24em] text-teal-700">Globexpert Seller Onboarding</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Register as Seller</h1>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Full name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
            required
          />
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            placeholder="Password"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 sm:col-span-2"
            required
          />
          <input
            type="text"
            name="businessName"
            value={form.businessName}
            onChange={onChange}
            placeholder="Business name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 sm:col-span-2"
            required
          />
          <textarea
            name="businessDescription"
            value={form.businessDescription}
            onChange={onChange}
            placeholder="Business description"
            rows={4}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500 sm:col-span-2"
          />
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-xl bg-[#0e1b32] px-4 py-3 font-medium text-white transition hover:bg-[#16325f] disabled:opacity-60"
        >
          {isLoading ? "Submitting..." : "Submit for Approval"}
        </button>

        <p className="mt-3 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-teal-700 hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
