import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { isRoleEnabled } from "../config/features";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) return null;

    const parsedUser = JSON.parse(savedUser);

    if (!isRoleEnabled(parsedUser?.role)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      return null;
    }

    return parsedUser;
  });

  const [loading, setLoading] = useState(true);

  const createDisabledAccountError = () => {
    const error = new Error("This account type is currently unavailable.");
    error.response = {
      data: {
        message: "This account type is currently unavailable.",
      },
    };

    return error;
  };

  const storeAuthenticatedUser = (authData) => {
    if (!isRoleEnabled(authData.user?.role)) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      throw createDisabledAccountError();
    }

    localStorage.setItem("accessToken", authData.accessToken);
    localStorage.setItem("user", JSON.stringify(authData.user));

    setUser(authData.user);

    return authData.user;
  };

  const login = async (emailOrPhone, password) => {
    const res = await API.post("/auth/login", {
      emailOrPhone,
      password,
    });

    return storeAuthenticatedUser(res.data);
  };

  const register = async (payload) => {
    const res = await API.post("/auth/register", payload);
    return res.data;
  };

  const googleLogin = async ({ credential, role } = {}) => {
    const res = await API.post("/auth/google", {
      credential,
      role,
    });

    return storeAuthenticatedUser(res.data);
  };

  const forgotPassword = async (email) => {
    const res = await API.post("/auth/forgot-password", { email });
    return res.data;
  };

  const resetPassword = async (token, password) => {
    const res = await API.post(`/auth/reset-password/${token}`, { password });
    return res.data;
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };

  const fetchMe = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      try {
        const refreshRes = await API.post("/auth/refresh-token");
        localStorage.setItem("accessToken", refreshRes.data.accessToken);

        if (refreshRes.data.user) {
          return storeAuthenticatedUser(refreshRes.data);
        }
      } catch (error) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
        return null;
      }
    }

    try {
      const res = await API.get("/auth/me");

      return storeAuthenticatedUser({
        accessToken: token,
        user: res.data.user,
      });
    } catch (error) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      setUser(null);
      return null;
    }
  };

  const checkAuth = async () => {
    try {
      await fetchMe();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleForcedLogout = () => setUser(null);

    window.addEventListener("auth:logout", handleForcedLogout);
    return () => window.removeEventListener("auth:logout", handleForcedLogout);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        googleLogin,
        forgotPassword,
        resetPassword,
        logout,
        fetchMe,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
