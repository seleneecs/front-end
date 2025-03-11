import { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem("userId") || null);
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [role, setRole] = useState(() => localStorage.getItem("role") || "ordinary_user");
  const [email, setEmail] = useState(() => localStorage.getItem("email") || "");
  const [loading, setLoading] = useState(true);

  const baseURL = import.meta.env.VITE_API_URL || "http://localhost:9000/api"; // Default for dev

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/auth/check-auth`, { withCredentials: true });

      if (response.data.user && response.data.user.id) {
        const { id, role, email } = response.data.user;
        setUserId(id);
        setToken(response.data.token);
        setRole(role || "ordinary_user");
        setEmail(email || "");

        // ✅ Save in localStorage for persistence
        localStorage.setItem("userId", id);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", role || "ordinary_user");
        localStorage.setItem("email", email || "");
      } else {
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
    setEmail("");

    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ userId, setUserId, token, setToken, role, setRole, email, setEmail, fetchUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };
