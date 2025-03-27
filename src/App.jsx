// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import FooterBar from "./components/FooterBar";
import UserRoutes from "./1_user/routes/UserRoutes";

export default function App() {
  const location = useLocation();
  const hideLayoutPaths = ["/swings", "/swings/login", "/swings/signup"];
  const hideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full">
      {!hideLayout && <NavBar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </main>

      {!hideLayout && <FooterBar />}
    </div>
  );
}
