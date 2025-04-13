import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Header.css";
import { UserContext } from "../../context/UserContext";

const Header = ({ children }) => {
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_URL;
  const { setUserId, userId, setToken, setRole, role, email } = useContext(UserContext);
  const [subscriptionData, setSubscriptionData] = useState("")

  const handleLogout = async () => {
    try {
        await axios.post(`${baseURL}/auth/logout`, {}, { withCredentials: true });

        // Ensure cookies are cleared before navigating
        document.cookie = "auth_token=; Max-Age=0; path=/; domain=.seleneecs.com;";
        document.cookie = "auth_token=; Max-Age=0; path=/; domain=seleneecs.com;";
        document.cookie = "auth_token=; Max-Age=0; path=/;";
        document.cookie = "auth_token=; Max-Age=0;";

        setUserId(null);
        setToken(null);
        setRole("ordinary_user");

        navigate("/", { replace: true });

        // Ensure cookie is removed before reloading
        setTimeout(() => {
            if (!document.cookie.includes("auth_token")) {
                window.location.reload();
            }
        }, 500);
    } catch (error) {
        console.error("Logout error:", error);
    }
};


  useEffect(() => {
    console.log("UserId changed in Header:", userId);
  }, [userId]);

  const handleFetchSubscriptionStatus = async (id) => {
    if (!id || isNaN(Number(id))) {
      console.error("Invalid ID passed to function:", id);
      return;
    }
  
    try {
      const response = await axios.get(`${baseURL}/api/subscription/${id}`, { withCredentials: true });
      console.log("Subscription Data:", response.data);
      
      setSubscriptionData(response.data.subscriptions);
    } catch (error) {
      console.error("Error fetching subscription:", error.response ? error.response.data : error.message);
    }
  };
  
  
  
  return (
    <div className="container-fluid border-bottom px-3">
      <div className="d-flex flex-row align-items-center justify-content-between">
        {/* Logo & Title */}
        <div className="d-flex align-items-center gap-3 flex-nowrap w-100 overflow-hidden">
          <img src="/logo.jpg" alt="Logo" className="logo-small flex-shrink-0" />
          <h1 className="fs-5 fs-md-4 mb-0 text-nowrap overflow-hidden text-truncate">
            Welcome to SeleneECS
          </h1>
        </div>

        {/* User Section */}
        {userId ? (
          <div className="d-flex align-items-center gap-3">
            {/* Logout Button (Visible) */}
            <button
              className="btn btn-outline-danger btn-sm px-3 w-auto"
              onClick={handleLogout}
            >
              Logout
            </button>

            {/* Dots (Dropdown) at the far right */}
            <div className="dropdown">
              <button
                className="btn p-0 border-0 bg-transparent"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-three-dots-vertical"></i>
              </button>
              <ul className="mt-2 dropdown-menu dropdown-menu-end w-auto" data-bs-auto-close="false">                
  <li className="px-3 py-2 text-nowrap">
    <h6 className="mb-0 custom-title">{email}</h6>
  </li>
  <li className="px-3 py-2 text-nowrap">
    <button className="btn btn-sm btn-primary" onClick={(e) => {
      e.stopPropagation(); // Prevent the dropdown from closing
      handleFetchSubscriptionStatus(userId);
    }}>
      Check Subscription
    </button>
  </li>

  {/* Display Subscription Data */}
  {subscriptionData && subscriptionData.length > 0 ? (
    subscriptionData.map((sub, index) => (
      <li key={index} className="px-3 py-2 text-nowrap border-top">
        <strong>Category:</strong> {sub.subscribed_category} <br />
        <strong>Amount:</strong> KES {sub.Amount} <br />
        <strong>Start:</strong> {new Date(sub.start_date).toLocaleDateString()} <br />
        <strong>End:</strong> {new Date(sub.end_date).toLocaleDateString()} <br />
      </li>
    ))
  ) : (
    <li className="px-3 py-2 text-muted">No active subscriptions</li>
  )}
</ul>





            </div>
          </div>
        ) : (
          <Link to="/login/register">
            <button className="btn btn-outline-greenish">Get Started</button>
          </Link>
        )}

        {children}
      </div>
    </div>
  );
};

export default Header;
