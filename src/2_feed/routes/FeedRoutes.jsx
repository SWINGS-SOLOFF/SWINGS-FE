import React from "react";
import { Routes, Route } from "react-router-dom";
import FeedPage from "../pages/FeedPage";
import SocialPage from "../pages/SocialPage";
import SocialProfile from "../components/SocialProfile";
import PrivateRoute from "../../1_user/components/PrivateRoute";

export default function FeedRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <FeedPage />
          </PrivateRoute>
        }
      />
      <Route
        path="social"
        element={
          <PrivateRoute>
            <SocialPage />
          </PrivateRoute>
        }
      />
      <Route
        path="social/profile/:userId"
        element={
          <PrivateRoute>
            <SocialProfile />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
