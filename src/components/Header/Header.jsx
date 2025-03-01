import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import { UserContext } from "../../context/UserCotext";

const Header = ({ children }) => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const { setUserId, userId, setToken, setRole } = useContext(UserContext);

  const handleLogout = async () => {
    try {
      console.log("Before logout - userId:", userId);

      await axios.post(`${baseURL}/auth/logout`, {}, { withCredentials: true });

      setUserId(null);
      setToken(null);
      setRole("ordinary_user");

      console.log("After logout - userId:", userId);

      navigate("/", { replace: true });
      
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // 🔥 UI updates immediately after userId changes
  useEffect(() => {
    console.log("UserId changed in Header:", userId);
  }, [userId]);

  return (
    <div className="d-flex flex-row align-items-center justify-content-between px-3 border-bottom">
      <div className="d-flex align-items-center gap-3">
        <img src="/logo.jpg" alt="Logo" className="logo-small" />
        <h1 className="fs-4 mb-0">Welcome to SeleneECS</h1>
      </div>

      {userId ? (
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <Link to="/login/register">
          <button className="btn btn-outline-greenish">Get Started</button>
        </Link>
      )}

      {children}
    </div>
  );
};

export default Header;
