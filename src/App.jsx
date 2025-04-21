import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import UserLayout from "./1_user/layouts/UserLayout";
import AdminLayout from "./1_user/layouts/AdminLayout";
import UserRoutes from "./1_user/routes/UserRoutes";
import AdminRoutes from "./1_user/routes/AdminRoutes";
import StartLogin from "./1_user/pages/StartLogin";
import SignUp from "./1_user/pages/SignUp";
import MatchRoutes from "./3_match/routes/MatchRoutes";
import ChatRoutes from "./3_match/routes/ChatRoutes";
import FeedRoutes from "./2_feed/routes/FeedRoutes";
import MatchGroupRoutes from "./4_matchgroup/routes/MatchGroupRoutes.jsx";
import NotificationRoutes from "./5_notification/routes/NotificationRoutes.jsx";
import SocialRoutes from "./2_feed/routes/SocialRoutes";
import SocialPage from "./2_feed/pages/SocialPage";
import MyPage from "./1_user/pages/MyPage";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  return (
    <>
      <ScrollToTop /> {/* ✅ 페이지 이동 시 스크롤 맨 위로 이동 */}
      <Routes>
        {/* Nginx root 요청*/}
        <Route path="/" element={<Navigate to="/swings" />} />

        {/* 로그인/회원가입 (Nav 없이) */}
        <Route path="/swings" element={<StartLogin />} />
        <Route path="/swings/signup" element={<SignUp />} />

        {/* 관리자 페이지 (AdminNavBar 포함) */}
        <Route path="/swings/admin/*" element={<AdminLayout />}>
          <Route path="*" element={<AdminRoutes />} />
        </Route>

        {/* 사용자 페이지 (NavBar + BottomNavBar 포함) */}
        <Route path="/swings/*" element={<UserLayout />}>
          <Route path="match/*" element={<MatchRoutes />} />
          <Route path="matchgroup/*" element={<MatchGroupRoutes />} />
          <Route path="chat/*" element={<ChatRoutes />} />
          <Route path="feed/*" element={<FeedRoutes />} />
          <Route path="social/*" element={<SocialRoutes />} />
          <Route path="notification/*" element={<NotificationRoutes />} />
          <Route path="profile/:userId" element={<SocialPage />} />
          <Route path="*" element={<UserRoutes />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>
      </Routes>
    </>
  );
}
