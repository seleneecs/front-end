import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import ResourceForm from "../ResourceForm/ResourceForm";
import AdminUserManagement from "./AdminUserManagement";
import SubscriptionManagement from "./subscriptionManagement";

const Support = () => {
  const { role, loading } = useContext(UserContext);
  const navigate = useNavigate();
  console.log("the user role is:", role)

  // Wait for loading to finish before checking access
  if (loading) {
    return <div>Loading...</div>;
  }

  // Restrict access to Admin and Staff only
  if (role === "admin") {
    return (
      <div className="container mt-4">
        <h2>Support - Admin Panel</h2>
        <SubscriptionManagement/>
        <AdminUserManagement />
      </div>
    );
  }

  if (role === "staff") {
    return (
      <div className="container mt-4">
        <h2>Support - Staff Panel</h2>
        {navigate("/resource/form")}
      </div>
    );
  }

  return (
    <div className="container mt-4 text-center">
      <h3 className="text-danger">Access Denied</h3>
      <p>You are not authorized to view this page.</p>
      <button className="btn btn-primary" onClick={() => navigate("/")}>
        Go Home
      </button>
    </div>
  );
};

export default Support;
