import {
  createContext,
  useState,
  useEffect,
  useContext,
  Children,
} from "react";
import { axios } from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem("accessToken") || null,
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem("refreshToken") || null,
  );
  const API_BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
  //axios defaults
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }

    return () => {};
  }, [accessToken]);

  //load user on mount if exists
  useEffect(() => {
    if (accessToken) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  //load user Data
  const loadUser = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/me`);
      if (response.data.success) {
        setUser(response);
      }
    } catch (error) {
      console.error("Failed to load user : ", error);
      if (error.response?.status === 401 && refreshToken) {
        const refreshed = handleRefreshToken();
        if (refreshed) {
          loadUser();
        } else {
          logout();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  //Register
  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });
      if (response.data.success) {
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user: newUser,
        } = response.data;
        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(newUser);

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);
        localStorage.setItem("user", newUser);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Registration Failed",
      };
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user: newUser,
        } = response.data;

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(newUser);

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Logout
  const logout = async () => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
      await axios.post(`${API_BASE_URL}/auth/logout`, {
        refreshToken,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Refresh token
  const handleRefreshToken = async () => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refreshToken,
      });

      if (response.data.success) {
        const newAccessToken = response.data.accessToken;
        setAccessToken(newAccessToken);
        localStorage.setItem("accessToken", newAccessToken);
        axios.defaults.headers.common["Authorization"] =
          `Bearer ${newAccessToken}`;
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
      const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        {
          email,
        },
      );

      return {
        success: true,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to send reset email",
      };
    }
  };

  // Reset password
  const resetPassword = async (token, password) => {
    try {
      const API_BASE_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api";
      const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password/${token}`,
        {
          password,
        },
      );

      if (response.data.success) {
        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user: newUser,
        } = response.data;

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);
        setUser(newUser);

        localStorage.setItem("accessToken", newAccessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Password reset failed",
      };
    }
  };
  const value = {
    user,
    loading,
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
