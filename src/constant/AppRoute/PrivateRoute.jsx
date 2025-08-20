// src/constant/AppRoute/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../routes";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to={ROUTES.LOGIN} replace />;
};

export default PrivateRoute;
