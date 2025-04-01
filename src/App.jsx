import { Routes, Route } from "react-router-dom";
import UserLayout from "./1_user/layouts/UserLayout";
import AdminLayout from "./1_user/layouts/AdminLayout";
import UserRoutes from "./1_user/routes/UserRoutes";
import AdminRoutes from "./1_user/routes/AdminRoutes";
import StartLogin from "./1_user/pages/StartLogin";
import SignUp from "./1_user/pages/SignUp";
import FeedRoutes from "./2_feed/routes/FeedRoutes.jsx";
import MatchRoutes from "./3_match/routes/MatchRoutes";
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
    <Routes>
      {/* 로그인 / 회원가입 (Nav 없이) */}
      <Route path="/swings" element={<StartLogin />} />
      <Route path="/swings/signup" element={<SignUp />} />

      {/* 관리자 페이지 (AdminNavBar 포함) */}
      <Route path="/swings/admin/*" element={<AdminLayout />}>
        <Route path="*" element={<AdminRoutes />} />
      </Route>

      <Route path="/swings/*" element={<UserLayout />}>
        <Route path="match/*" element={<MatchRoutes />} />
        <Route path="matchgroup/*" element={<MatchGroupRoutes />} />
        <Route path="feed/*" element={<FeedRoutes />} />
        <Route path="social/*" element={<FeedRoutes />} />
        <Route path="*" element={<UserRoutes />} />
      </Route>

      {/* 매치 그룹 페이지 */}
    </Routes>
  );
}
