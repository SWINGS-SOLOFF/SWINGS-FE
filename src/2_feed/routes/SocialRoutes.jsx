import React from "react";
import { Routes, Route } from "react-router-dom";
import SocialPage from "../pages/SocialPage";
import PrivateRoute from "../../1_user/components/PrivateRoute";

export default function SocialRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <SocialPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile/:userId"
        element={
          <PrivateRoute>
            <SocialPage />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}