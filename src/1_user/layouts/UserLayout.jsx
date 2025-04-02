// src/layouts/UserLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../../components/NavBar";
import BottomNavBar from "../../components/BottomNavBar";

// ✅ 숨길 경로 목록 설정
const hideNavBarPaths = ["/login", "/signup", "/swings/match"];
const hideBottomBarPaths = ["/login", "/signup", "/swings/match"];

export default function UserLayout() {
  const location = useLocation();
  const { pathname } = location;

  const hideNavBar = hideNavBarPaths.includes(pathname);
  const hideBottomBar = hideBottomBarPaths.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* ✅ NavBar는 조건부 렌더링 */}
      {!hideNavBar && <NavBar />}

      <main className="flex-grow pb-16">
        <Outlet />
      </main>

      {/* ✅ BottomNavBar도 조건부 렌더링 */}
      {!hideBottomBar && <BottomNavBar />}
    </div>
  );
}
