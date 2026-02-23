import React, { createContext, useContext, useState } from "react";
import { api } from "../lib/api/axios";
import { AxiosError } from "axios";

type User = {
  id: number;
  username: string;
  email?: string;
  firstName?: string;
  secondName?: string;
  profileImage?: string;
  description?: string;
  bio?: string;
  likesCount?: number;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token") || null;
  });

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await api.post("/api/login", { email, password });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser(user);
    } catch (err: unknown) {
      let message = "Login eerror";

      if (err instanceof AxiosError && err.response?.data) {
        const serverData = err.response.data as { message?: string };
        if (serverData.message) {
          message = serverData.message;
        }
      }

      throw new Error(message);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/signup", { email, password });
      return response.data;
    } catch (err: unknown) {
      let message = "Registration error";

      if (err instanceof AxiosError && err.response?.data) {
        const serverData = err.response.data as { message?: string };
        if (serverData.message) {
          message = serverData.message;
        }
      }

      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/logout").catch(() => {});
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) {
        return prev;
      }
      const updated = { ...prev, ...data };
      localStorage.setItem("user", JSON.stringify(updated));
      return updated;
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user && !!token,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  
  return context;
}
