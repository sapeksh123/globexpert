import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback((message, tone = "info") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [...prev, { id, message, tone, type: "info" }]);

    setTimeout(() => removeToast(id), 3000);
  }, [removeToast]);

  const showConfirmToast = useCallback((message, onConfirm) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((prev) => [
      ...prev,
      {
        id,
        message,
        tone: "info",
        type: "confirm",
        onConfirm,
      },
    ]);
  }, []);

  const value = useMemo(() => ({ showToast, showConfirmToast }), [showToast, showConfirmToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto relative overflow-hidden rounded-2xl border px-4 py-3 text-sm shadow-lg shadow-slate-900/10 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 ${
              toast.tone === "success"
                ? "border-emerald-200 bg-emerald-50/95 text-emerald-800"
                : toast.tone === "error"
                  ? "border-rose-200 bg-rose-50/95 text-rose-800"
                  : "border-slate-200 bg-white/95 text-slate-800"
            }`}
          >
            <span
              className={`absolute inset-y-0 left-0 w-1.5 ${
                toast.tone === "success"
                  ? "bg-emerald-500"
                  : toast.tone === "error"
                    ? "bg-rose-500"
                    : "bg-slate-400"
              }`}
            />
            <p>{toast.message}</p>
            {toast.type === "confirm" ? (
              <div className="mt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className="rounded-lg border border-slate-300 bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-white"
                >
                  No
                </button>
                <button
                  type="button"
                  onClick={() => {
                    removeToast(toast.id);
                    if (typeof toast.onConfirm === "function") {
                      toast.onConfirm();
                    }
                  }}
                  className="rounded-lg bg-red-700 px-2.5 py-1 text-xs font-medium text-white transition hover:bg-red-800"
                >
                  YES, LOGOUT
                </button>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
