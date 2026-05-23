import { useState } from "react";
import { LuArrowRight, LuEye, LuEyeOff, LuShieldCheck, LuSparkles } from "react-icons/lu";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const accessPoints = [
  "Fast access for admin and approved seller accounts",
  "Cleaner sign-in flow with stronger visual hierarchy",
  "Registration path for new seller onboarding",
];

const stats = [
  { value: "24/7", label: "panel access" },
  { value: "2 roles", label: "admin and seller" },
  { value: "1 click", label: "to reach the dashboard" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const getErrorMessage = (err) => {
    const status = err?.response?.status;
    const responseMessage = String(err?.response?.data?.message || "");

    if (status === 401 || status === 400) {
      return "Invalid credentials";
    }

    if (status === 403) {
      if (responseMessage.toLowerCase().includes("not approved")) {
        return "your account is not approved please contact to admin";
      }
      return "Your account is inactive. Please contact support.";
    }

    const errors = err?.response?.data?.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      return "Invalid credentials";
    }
    return responseMessage || err?.normalizedMessage || "Login failed";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.email.includes("@") || !form.password.trim()) {
      setError("Enter a valid email and password");
      showToast("Enter a valid email and password", "error");
      return;
    }

    setIsLoading(true);

    try {
      const loggedInUser = await login(form);

      if (!["ADMIN", "SELLER"].includes(loggedInUser?.role)) {
        logout();
        const message = "This web panel is only for Admin or Seller accounts.";
        setError(message);
        showToast(message, "error");
        return;
      }

      showToast("Login successful", "success");
      navigate("/dashboard");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#08111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(31,138,112,0.22),transparent_30%),radial-gradient(circle_at_top_right,rgba(244,231,210,0.15),transparent_28%),linear-gradient(135deg,#08111f_0%,#0e1b32_55%,#16325f_100%)]" />
      <div className="absolute left-[-8rem] top-[-6rem] h-72 w-72 rounded-full bg-[#1f8a70]/20 blur-3xl" />
      <div className="absolute bottom-[-7rem] right-[-5rem] h-80 w-80 rounded-full bg-[#f4e7d2]/10 blur-3xl" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid w-full items-stretch gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_30px_90px_rgba(2,6,23,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_32%,rgba(255,255,255,0.02)_68%,transparent)]" />
            <div className="relative flex h-full flex-col justify-between gap-8">
              <div className="flex items-center gap-3 text-sm font-medium text-white/85">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#f4e7d2] shadow-lg shadow-black/20">
                  <LuShieldCheck className="text-xl" />
                </span>
                <div>
                  <p className="uppercase tracking-[0.32em] text-white/55">Globexpert</p>
                  <p className="text-base text-white/80">Admin and Seller portal</p>
                </div>
              </div>

              <div className="max-w-xl">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#1f8a70]/30 bg-[#1f8a70]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#8ce3cd]">
                  <LuSparkles className="text-sm" /> Secure access
                </p>
                <h1 className="mt-5 max-w-lg text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Sign in to manage orders, products, and seller workflows.
                </h1>
                <p className="mt-4 max-w-lg text-base leading-7 text-white/72 sm:text-lg">
                  A cleaner entry point for approved admins and sellers, designed to feel more polished and easier to use on every screen size.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                    <p className="text-2xl font-semibold text-white">{item.value}</p>
                    <p className="mt-1 text-sm text-white/62">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-3">
                {accessPoints.map((point) => (
                  <div key={point} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/80">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#1f8a70]/20 text-[#8ce3cd]">
                      <LuShieldCheck className="text-base" />
                    </span>
                    <p className="leading-6">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/96 p-6 text-slate-900 shadow-[0_30px_90px_rgba(2,6,23,0.38)] backdrop-blur-xl sm:p-8 lg:p-10"
          >
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-[#1f8a70]/10 blur-3xl" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#1f8a70]">Globexpert login</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Welcome back</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
                Sign in with your approved admin or seller account to continue to the dashboard.
              </p>

              <div className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Email address</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@company.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-[15px] outline-none transition placeholder:text-slate-400 focus:border-[#1f8a70] focus:bg-white focus:ring-4 focus:ring-[#1f8a70]/10"
                    required
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-[15px] outline-none transition placeholder:text-slate-400 focus:border-[#1f8a70] focus:bg-white focus:ring-4 focus:ring-[#1f8a70]/10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <LuEyeOff className="text-lg" /> : <LuEye className="text-lg" />}
                    </button>
                  </div>
                </label>
              </div>

              {error ? (
                <p className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isLoading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0e1b32] px-4 py-3.5 font-semibold text-white shadow-lg shadow-[#0e1b32]/20 transition duration-200 hover:-translate-y-0.5 hover:bg-[#16325f] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {isLoading ? "Signing in..." : "Sign in"}
                {!isLoading ? <LuArrowRight className="text-lg" /> : null}
              </button>

              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                <p className="font-medium text-slate-800">Need seller access?</p>
                <p className="mt-1 leading-6">
                  Create a seller account and wait for approval before signing in.
                </p>
                <p className="mt-3">
                  <Link to="/register-seller" className="inline-flex items-center gap-1 font-semibold text-[#1f8a70] transition hover:text-[#166754] hover:underline">
                    Register here
                    <LuArrowRight className="text-base" />
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
