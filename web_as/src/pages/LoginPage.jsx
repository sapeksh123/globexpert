import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

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

    if (status === 401 || status === 400) {
      return "Invalid credentials";
    }

    if (status === 403) {
      return "Your account is inactive. Please contact support.";
    }

    const errors = err?.response?.data?.errors;
    if (Array.isArray(errors) && errors.length > 0) {
      return "Invalid credentials";
    }
    return err?.response?.data?.message || err?.normalizedMessage || "Login failed";
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
    <div className="flex min-h-screen items-center justify-center bg-[conic-gradient(at_bottom_left,#0e1b32,#16325f,#1f8a70,#f4e7d2)] p-3 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-5 shadow-2xl sm:p-8"
      >
        <p className="text-xs uppercase tracking-[0.24em] text-teal-700">Globexpert Admin/Seller</p>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">Sign In</h1>

        <div className="mt-6 space-y-4">
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-500"
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:border-teal-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <LuEyeOff className="text-lg" /> : <LuEye className="text-lg" />}
            </button>
          </div>
        </div>

        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 w-full rounded-xl bg-[#0e1b32] px-4 py-3 font-medium text-white transition hover:bg-[#16325f] disabled:opacity-60"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
