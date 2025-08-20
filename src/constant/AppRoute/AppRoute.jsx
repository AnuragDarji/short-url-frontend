import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../routes";
import Login from "@/pages/Login/Login";
import Signup from "@/pages/Signup/Signup";
import Dashboard from "@/pages/Home/Home"; // your Home is actually Dashboard
import PrivateRoute from "./PrivateRoute";

const AppRoute = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />

      {/* Private route */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoute;
