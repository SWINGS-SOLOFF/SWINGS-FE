// src/App.jsx
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import FooterBar from "./components/FooterBar";
import UserRoutes from "./1_user/routes/UserRoutes";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />

      <Routes>
        <Route path="/*" element={<UserRoutes />} />
      </Routes>

      <FooterBar />
    </div>
  );
}
