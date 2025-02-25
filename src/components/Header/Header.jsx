import React, { useEffect, useState, createContext, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";

// ✅ Create Authentication Context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const Header = ({ children }) => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // ✅ Store user details
  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fullURL = `${baseURL}/auth/check-auth`;
    axios
      .get(fullURL, { withCredentials: true })
      .then((response) => {
        setIsLoggedIn(response.data.loggedIn);
        setUser(response.data.user); // ✅ Store user details
      })
      .catch((error) => {
        console.error("Error checking auth:", error);
        setIsLoggedIn(false);
        setUser(null);
      });
  }, []);

  const handleLogout = () => {
    axios
      .post(`${baseURL}/auth/logout`, {}, { withCredentials: true })
      .then(() => {
        setIsLoggedIn(false);
        setUser(null);
        navigate("/auth/login");
      })
      .catch((error) => console.error("Logout error:", error));
  };

  return (
    <AuthContext.Provider value={{ user }}>
      <div className="d-flex flex-row align-items-center justify-content-between px-3 border-bottom">
        <div className="d-flex align-items-center gap-3">
          <img src="/logo.jpg" alt="Logo" className="logo-small" />
          <h1 className="fs-4 mb-0">Welcome to SeleneECS</h1>
        </div>

        {isLoggedIn ? (
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/auth/login">
            <button className="btn btn-outline-greenish">Get Started</button>
          </Link>
        )}
      </div>

      {/* ✅ Provide Auth Context for the entire app */}
      {children}
    </AuthContext.Provider>
  );
};

export default Header;
