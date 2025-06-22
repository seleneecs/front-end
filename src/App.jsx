import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import LaunchOverlay from "./components/LaunchOverLay/LaunchOverlay";

const App = () => {
  const [showOverlay, setShowOverlay] = useState(true);

  return showOverlay ? (
    <LaunchOverlay onContinue={() => setShowOverlay(false)} />
  ) : (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
