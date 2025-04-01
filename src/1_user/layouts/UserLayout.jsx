// src/layouts/UserLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar";
import BottomNavBar from "../../components/BottomNavBar";

const showBottomBarPaths = [
  "/swings/home",
  "/swings/join",
  "/swings/mate",
  "/swings/feed",
  "/swings/mypage",
  "/swings/match",
  "/swings/matchgroup",
  "/swings/chat",
  "/swings/settings",
];

export default function UserLayout() {
  const location = useLocation();
  const showBottomBar = showBottomBarPaths.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <NavBar />
      <main className="flex-grow pb-16">
        <Outlet />
      </main>
      {showBottomBar && <BottomNavBar />}
    </div>
  );
}
