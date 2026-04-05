// context/AuthContext.tsx
"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "@/config";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "user";
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: "admin" | "user" | null;
  login: (userData: { email: string; password: string }) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setToken(storedToken);
        await fetchUser(storedToken);
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const req = await fetch(`${BASE_URL}/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (req.ok) {
        const res = await req.json();
        setUser(res.data);
        setRole(res.data.role);
      } else {
        // Token غير صالح
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setRole(null);
      }
    } catch (e) {
      console.error("Error fetching user:", e);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.data);
        setRole(data.data.role);
        router.push("/");
      } else {
        console.error("Registration failed:", data.message);
        throw new Error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const login = async (userData: { email: string; password: string }) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.data);
        setRole(data.data.role);
        router.push("/");
      } else {
        console.error("Login failed:", data.message);
        throw new Error(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${BASE_URL}/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // بغض النظر عن نتيجة الـ API، نقوم بتنظيف الـ localStorage
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setRole(null);
      router.push("/login");
    }
  };

  const values: AuthContextType = {
    user,
    token,
    role,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
