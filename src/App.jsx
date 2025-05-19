import React from "react"

import {BrowserRouter} from "react-router-dom"
import AppRoutes from "./AppRoutes"
import ComingSoon from "./components/comingSoon"


const showComingSoon = true;

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