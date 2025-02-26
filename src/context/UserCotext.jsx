import { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState("ordinary_user");
  const [loading, setLoading] = useState(true); // ✅ Track loading state

  const baseURL = import.meta.env.VITE_API_URL;

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
        console.log("User ID Set:", response.data.user.id);
      } else {
        console.warn("⚠️ No user ID in response:", response.data);
        setUserId(null);
      }
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      setUserId(null);
    }
    setLoading(false);
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
