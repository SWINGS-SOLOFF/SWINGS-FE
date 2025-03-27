import { Routes, Route, useLocation } from "react-router-dom";
import FooterBar from "./components/FooterBar.jsx";
import UserRoutes from "./1_user/routes/UserRoutes";
import MatchGroupRoutes from "./4_matchgroup/routes/MatchGroupRoutes.jsx";
import NavBar from "./components/NavBar.jsx";

export default function App() {
  const location = useLocation();
  const hideLayoutPaths = ["/", "/login", "/signup"];
  const hideLayout = hideLayoutPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full">
      {!hideLayout && <NavBar />}

      <main className="flex-grow">
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
          <Route path="/swings/matchgroup/*" element={<MatchGroupRoutes />} />
        </Routes>
      </main>

      {!hideLayout && <FooterBar />}
    </div>
  );
}
