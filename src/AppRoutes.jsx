import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home/Home";

import DynamicDataDisplay from "./components/DynamicDataDisplay/DynamicDataDisplay";
import ResourceForm from "./components/ResourceForm/ResourceForm";

import SubscriptionForm from "./components/Subscription/Subscription"; // ✅ Import the component
import LoginRegister from "./components/Auth/LoginRegister";
import AdminUserManagement from "./components/Support/Support";







const AppRoutes = () => (
  <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resource/form" element={<ResourceForm/>} />
      <Route path="/display" element={<DynamicDataDisplay/>}/>          
      <Route path="/login/register" element={<LoginRegister/>}/>        
      <Route path="/subscription" element={<SubscriptionForm />} /> {/* ✅ Add this route */}
      <Route path="/admin/user/management" element={<AdminUserManagement />} /> {/* ✅ Add this route */}
      <Route path="/support" element={<AdminUserManagement />} /> {/* ✅ Add this route */}
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    
    </Routes>
  </>
);

export default AppRoutes;
