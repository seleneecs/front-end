import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home/Home";
import ResourceForm from "./components/ResourceForm/ResourceFrom";


const AppRoutes = () => (
  <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resource/form" element={<ResourceForm />} />
    </Routes>
  </>
);

export default AppRoutes;
