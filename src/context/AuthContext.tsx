"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "@/config";
import { useRouter } from "next/navigation";

export const AuthContext = createContext({});

export const AuthProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState();
  const router = useRouter();

  useEffect(() => {
    try {
      const fetchUser = async () => {
        const req = await fetch(BASE_URL + "/me", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        const res = await req.json();
        setUser(res.data);
        setToken(res.token);
        setRole(res.data.role);
      };

      fetchUser();
    } catch (e) {
      console.log(e);
    }
  }, []);

  const register = async (userData: Object) => {
    try {
      const response = await fetch(BASE_URL + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data) {
        // localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("token", data.token);
        setUser(data.data);
        setToken(data.token);
        router.push("/");
      } else {
        console.error("Something Went Wrong!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const login = async (userData: Object) => {
    try {
      const response = await fetch(BASE_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data) {
        // localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("token", data.token);
        setUser(data.data);
        setToken(data.token);
        setRole(data.data.role);
        router.push("/");
      } else {
        console.error("Something Went Wrong!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch(BASE_URL + "/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      // localStorage.removeItem("role");
      localStorage.removeItem("token");
      // localStorage.removeItem("user");
      location.reload();
      router.push("/");
    } catch (err) {
      console.error(err);
    }
  };

  const values = { user, role, token, login, register, logout };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error("Error Auth!");
  }

  return context;
};
