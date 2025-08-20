import React from "react";
import { Route, Routes } from "react-router-dom";
import { ROUTES } from "../routes";
import Login from "@/pages/Login/Login";
import Signup from "@/pages/Signup/Signup";
import Dashboard from "@/pages/Home/Home";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Layout from "@/Layout/Layout";
import UrlHistory from "@/pages/UrlHistory/UrlHistory";

const AppRoute = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.SIGNUP}
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      />

      {/* Private route */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.URLHISTORY} element={<UrlHistory />} />
      </Route>
    </Routes>
  );
};

export default AppRoute;
