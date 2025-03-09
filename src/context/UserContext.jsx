import { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [role, setRole] = useState(() => localStorage.getItem("role") || "ordinary_user");
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:9000/api"; // Default for dev

  const fetchUser = async () => {
    setLoading(true);
    try {
      console.log("Fetching user data...");
      const response = await axios.get(`${baseURL}/auth/check-auth`, { withCredentials: true });

      console.log("API Response:", response.data);

      if (response.data.user && response.data.user.id) {
        setUserId(response.data.user.id);
        setToken(response.data.token);
        setRole(response.data.user.role || "ordinary_user");

        // ✅ Save in localStorage for persistence
        localStorage.setItem("userId", response.data.user.id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", response.data.user.role || "ordinary_user");

        console.log("✅ User authenticated:", response.data.user);
      } else {
        console.warn("⚠️ No user ID in response:", response.data);
        resetUser();
      }
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      resetUser();
    }
    setLoading(false);
  };

  const resetUser = () => {
    setUserId(null);
    setToken(null);
    setRole("ordinary_user");

    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId, token, setToken, role, setRole, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
