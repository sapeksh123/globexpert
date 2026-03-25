import { createContext, useContext, useMemo, useState } from "react";
import apiClient from "../services/apiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("ge_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = async ({ email, password }) => {
    const response = await apiClient.post("/auth/login", { email, password });
    const payload = response.data?.data;

    localStorage.setItem("ge_token", payload.token);
    localStorage.setItem("ge_user", JSON.stringify(payload.user));
    setUser(payload.user);

    return payload.user;
  };

  const logout = () => {
    localStorage.removeItem("ge_token");
    localStorage.removeItem("ge_user");
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
