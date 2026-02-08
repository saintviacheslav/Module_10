import React, { createContext, useContext, useState } from "react";
import { users } from "../mock/users";

type User = {
  id: number;
  name: string;
  surname: string;
  username: string;
  avatar: string;
  email: string;
  description?: string;
};

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email: string, password: string) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!foundUser) {
      return false;
    }

    setUser(foundUser);
    localStorage.setItem("user", JSON.stringify(foundUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) {
        return prev;
      }

      const updatedUser = { ...prev, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: user !== null,
    login,
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
