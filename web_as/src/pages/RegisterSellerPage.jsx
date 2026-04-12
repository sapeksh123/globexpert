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
    <div className="auth-shell min-h-screen bg-[#08111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(31,138,112,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(244,231,210,0.16),transparent_28%),linear-gradient(135deg,#08111f_0%,#0e1b32_55%,#16325f_100%)]" />
      <div className="auth-float absolute -left-24 -top-16 h-72 w-72 rounded-full bg-[#1f8a70]/20 blur-3xl" />
      <div className="auth-float absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-[#f4e7d2]/10 blur-3xl" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full gap-6 lg:grid-cols-[0.96fr_1.04fr]">
          <section className="auth-card relative overflow-hidden rounded-4xl border border-white/10 bg-white/6 p-6 shadow-[0_30px_90px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_30%,rgba(255,255,255,0.03)_70%,transparent)]" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="flex items-center gap-3 text-sm font-medium text-white/85">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#f4e7d2] shadow-lg shadow-black/20">
                  <span className="text-xl">✦</span>
                </span>
                <div>
                  <p className="uppercase tracking-[0.32em] text-white/55">Globexpert</p>
                  <p className="text-base text-white/80">Seller onboarding</p>
                </div>
              </div>

              <div className="max-w-xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#1f8a70]/30 bg-[#1f8a70]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#8ce3cd]">
                  Faster approval flow
                </p>
                <h1 className="mt-5 max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Create a seller profile with a cleaner, more polished onboarding flow.
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-white/72 sm:text-lg">
                  New sellers get a focused registration experience, clearer business details, and a smoother transition into approval.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: "Fast", label: "account setup" },
                  { value: "Clear", label: "approval step" },
                  { value: "Secure", label: "seller access" },
                ].map((item) => (
                  <div key={item.label} className="auth-card rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-sm text-white/62">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                {[
                  "Capture the essentials for business verification.",
                  "Guide sellers to complete approval-ready onboarding.",
                  "Keep the form readable on phones and larger screens.",
                ].map((point, index) => (
                  <div
                    key={point}
                    className={`auth-card auth-delay-${Math.min(index + 1, 3)} flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/80`}
                  >
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f8a70]/20 text-[#8ce3cd]">
                      <span className="text-xs font-bold">0{index + 1}</span>
                    </span>
                    <p className="leading-6">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <form
            onSubmit={onSubmit}
            className="auth-card relative overflow-hidden rounded-4xl border border-white/70 bg-white/96 p-6 text-slate-900 shadow-[0_30px_90px_rgba(2,6,23,0.38)] backdrop-blur-xl sm:p-8 lg:p-10"
          >
            <div className="auth-float absolute right-0 top-0 h-28 w-28 rounded-full bg-[#1f8a70]/10 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1f8a70]">Globexpert seller onboarding</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Register as Seller</h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
                Submit your details and wait for admin approval before signing in to the seller dashboard.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Full name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1f8a70] focus:bg-white focus:ring-4 focus:ring-[#1f8a70]/10"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1f8a70] focus:bg-white focus:ring-4 focus:ring-[#1f8a70]/10"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={onChange}
                  placeholder="Password"
                  className="sm:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1f8a70] focus:bg-white focus:ring-4 focus:ring-[#1f8a70]/10"
                  required
                />
                <input
                  type="text"
                  name="businessName"
                  value={form.businessName}
                  onChange={onChange}
                  placeholder="Business name"
                  className="sm:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1f8a70] focus:bg-white focus:ring-4 focus:ring-[#1f8a70]/10"
                  required
                />
                <textarea
                  name="businessDescription"
                  value={form.businessDescription}
                  onChange={onChange}
                  placeholder="Business description"
                  rows={4}
                  className="sm:col-span-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#1f8a70] focus:bg-white focus:ring-4 focus:ring-[#1f8a70]/10"
                />
              </div>

              {error ? (
                <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="auth-card auth-delay-3 mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0e1b32] px-4 py-3.5 font-semibold text-white shadow-lg shadow-[#0e1b32]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#16325f] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isLoading ? "Submitting..." : "Submit for Approval"}
              </button>

              <p className="mt-4 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-[#1f8a70] transition hover:text-[#166754] hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
