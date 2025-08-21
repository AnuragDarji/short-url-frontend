import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoute from "./constant/AppRoute/AppRoute";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#fff",
              border: "1px solid #374151",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
            loading: {
              iconTheme: {
                primary: "#3b82f6",
                secondary: "#fff",
              },
            },
          }}
        />
        <AppRoute />
      </Router>
    </AuthProvider>
  );
};

export default App;
