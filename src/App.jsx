// src/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import FooterBar from "./components/FooterBar";
import BottomNavBar from "./components/BottomNavBar";
import UserRoutes from "./1_user/routes/UserRoutes";

export default function App() {
  const location = useLocation();

  // 경로별로 NavBar, FooterBar, BottomNavBar 숨김 조건 설정
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
        {" "}
        {/* 하단 여백 확보 */}
        <Routes>
          <Route path="/*" element={<UserRoutes />} />
        </Routes>
      </main>

      {showBottomBar && <BottomNavBar />}
    </div>
  );
}
