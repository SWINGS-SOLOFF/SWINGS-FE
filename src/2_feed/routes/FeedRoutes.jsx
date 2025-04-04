import React from "react";
import { Routes, Route } from "react-router-dom";
import FeedPage from "../pages/FeedPage";
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
    </Routes>
  );
}
