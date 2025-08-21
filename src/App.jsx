import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoute from "./constant/AppRoute/AppRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <AppRoute />
      </Router>
    </AuthProvider>
  );
};

export default App;
