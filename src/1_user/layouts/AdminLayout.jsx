// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminNavBar from "../../components/AdminNavBar";

export default function AdminLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <AdminNavBar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}
