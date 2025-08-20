// src/constant/AppRoute/PublicRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { ROUTES } from "../routes";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to={ROUTES.DASHBOARD} replace /> : children;
};

export default PublicRoute;
