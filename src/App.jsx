import { Routes, Route } from "react-router-dom";
import UserLayout from "./1_user/layouts/UserLayout";
import AdminLayout from "./1_user/layouts/AdminLayout";
import UserRoutes from "./1_user/routes/UserRoutes";
import AdminRoutes from "./1_user/routes/AdminRoutes";
import StartLogin from "./1_user/pages/StartLogin";
import SignUp from "./1_user/pages/SignUp";
import MatchRoutes from "./3_match/routes/MatchRoutes";

export default function App() {
  return (
    <Routes>
      {/* ✅ 로그인/회원가입 (Nav 없이) */}
      <Route path="/swings" element={<StartLogin />} />
      <Route path="/swings/signup" element={<SignUp />} />

      {/* ✅ 관리자 페이지 (AdminNavBar 포함) */}
      <Route path="/swings/admin/*" element={<AdminLayout />}>
        <Route path="*" element={<AdminRoutes />} />
      </Route>

        
        <Route path="/swings/match/*" element={<MatchRoutes />} />

      {/* ✅ 사용자 페이지 (NavBar + BottomNavBar 포함) */}
      <Route path="/swings/*" element={<UserLayout />}>
        <Route path="*" element={<UserRoutes />} />
      </Route>

    </Routes>