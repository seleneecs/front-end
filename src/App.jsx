import React from "react"

import {BrowserRouter} from "react-router-dom"
import AppRoutes from "./AppRoutes"
import ComingSoon from "./components/comingSoon"


let showComingSoon = false;

const App = () => {
  return showComingSoon ? (
    <ComingSoon />
  ) : (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;