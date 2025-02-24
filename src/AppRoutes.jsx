import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./components/Home/Home";

import DynamicDataDisplay from "./components/DynamicDataDisplay/DynamicDataDisplay";
import ResourceForm from "./components/ResourceForm/ResourceForm";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Register";





const AppRoutes = () => (
  <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/resource/form" element={<ResourceForm/>} />
      <Route path="/display" element={<DynamicDataDisplay/>}/>
      <Route path="/auth/login" element={<Login/>}/>
      <Route path="/auth/signup" element={<Signup/>}/>
    
    </Routes>
  </>
);

export default AppRoutes;
