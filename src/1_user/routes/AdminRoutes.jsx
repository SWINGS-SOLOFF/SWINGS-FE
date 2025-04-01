// src/1_user/routes/AdminRoutes.jsx
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUserList from "../pages/AdminUserList";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        path=""
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="users"
        element={
          <PrivateRoute>
            <AdminUserList />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
