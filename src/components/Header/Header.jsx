import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <div className="d-flex flex-row align-items-center justify-content-between px-3 border-bottom">
      <div className="d-flex align-items-center gap-3">
        <img src="/logo.jpg" alt="Logo" className="logo-small" />
        <h1 className="fs-4 mb-0">Welcome to seleneECS</h1>
      </div>
      
      {/* Get Started Button wrapped with Link */}
      <Link to="/auth/login">
        <button className="btn btn-outline-greenish">Get Started</button>
      </Link>
    </div>
  );
};

export default Header;
