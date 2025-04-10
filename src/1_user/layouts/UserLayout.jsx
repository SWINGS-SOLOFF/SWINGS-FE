import { Outlet, useLocation } from "react-router-dom";
import NavBar from "../../components/TopNavBar";
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
    <div className="flex flex-col min-h-screen w-full overflow-y-scroll scrollbar-hide">
      {/* ✅ 상단 고정 NavBar */}
      {!hideNavBar && <NavBar />}

      {/* ✅ 본문 영역 - NavBar/BottomNavBar 고려한 padding */}
      <main
        className={`flex-grow ${!hideNavBar ? "pt-16" : ""} ${
          !hideBottomBar ? "pb-16" : ""
        }`}
      >
        <Outlet />
      </main>

      {/* ✅ 하단 고정 BottomNavBar */}
      {!hideBottomBar && <BottomNavBar />}
    </div>
  );
}
