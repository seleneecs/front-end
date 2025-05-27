import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home/Home";

import DynamicDataDisplay from "./components/DynamicDataDisplay/DynamicDataDisplay";
import ResourceForm from "./components/ResourceForm/ResourceForm";

import SubscriptionForm from "./components/Subscription/Subscription"; // ✅ Import the component

import AdminUserManagement from "./components/Support/Support";
import SubscriptionManagement from "./components/Support/subscriptionManagement";
import AuthPage from "./components/Auth/AuthPage";
import OthersSection from "./components/otherScollResources/OthersSection";
import ComingSoon from "./components/comingSoon";








const AppRoutes = () => (
  <>
     <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resource/form" element={<ResourceForm />} />
      <Route path="/display" element={<DynamicDataDisplay />} />
      <Route path="/login/register" element={<AuthPage />} /> {/* ✅ Replaced with AuthPage */}
      <Route path="/subscriptions" element={<SubscriptionForm />} />
      <Route path="/admin/user/management" element={<AdminUserManagement />} />
      <Route path="/support" element={<AdminUserManagement />} />
      <Route path="/subscription/management" element={<SubscriptionManagement />} />
      <Route path="/others" element={<OthersSection />} />
      <Route path="/coming/soon" element={<ComingSoon />} />
      <Route path="*" element={<div>404 - Page Not Found</div>} />
    </Routes>
  </>
);

export default AppRoutes;
