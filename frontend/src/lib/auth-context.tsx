import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { api, type User } from "./api";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "auth_token";

const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem(TOKEN_KEY);
    delete api.defaults.headers.common["Authorization"];
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user || data);
    } catch {
      setUser(null);
      setAuthToken(null);
    }
  };

  useEffect(() => {
    // Load token from localStorage on mount
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      setAuthToken(token);
    }
    refresh().finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    const u = data.user || data;
    const token = data.token || data._token;
    if (token) {
      setAuthToken(token);
    }
    setUser(u);
    return u;
  };

  const register = async (payload: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    const { data } = await api.post("/auth/register", payload);
    const u = data.user || data;
    const token = data.token || data._token;
    if (token) {
      setAuthToken(token);
    }
    setUser(u);
    return u;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {}
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
