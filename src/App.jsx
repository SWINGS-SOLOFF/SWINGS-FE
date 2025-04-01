import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import UserRoutes from "./1_user/routes/UserRoutes";
import MatchGroupRoutes from "./4_matchgroup/routes/MatchGroupRoutes.jsx";

export default function App() {
  const location = useLocation();

  const hideNavPaths = ["/swings", "/swings/signup"];
  const showBottomBarPaths = [
    "/swings/home",
    "/swings/join",
    "/swings/mate",
    "/swings/feed",
    "/swings/mypage",
  ];

  const hideNav = hideNavPaths.includes(location.pathname);
  const showBottomBar = showBottomBarPaths.includes(location.pathname);

  return (
      <div className="flex flex-col min-h-screen w-full">
        {!hideNav && <NavBar />}

        <main className="flex-grow pb-16">
          <Routes>
            <Route path="/*" element={<UserRoutes />} />
            <Route path="/swings/matchgroup/*" element={<MatchGroupRoutes />} />
          </Routes>
        </main>

        {showBottomBar && <BottomNavBar />}
      </div>
  );
}
