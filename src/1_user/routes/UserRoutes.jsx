import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import StartLogin from "../pages/StartLogin";
import SignUp from "../pages/SignUp";
import MyPage from "../pages/MyPage";
import UpdateForm from "../components/UpdateForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import DeleteUser from "../components/DeleteUser";
import PrivateRoute from "../components/PrivateRoute"; // ✅ 추가
import AdminDashboard from "../pages/AdminDashboard";
import AdminUserList from "../pages/AdminUserList";

export default function UserRoutes() {
  return (
    <Routes>
      {/* ✅ 비로그인 상태에서도 접근 가능한 경로 */}
      <Route path="/swings" element={<StartLogin />} />
      <Route path="/swings/signup" element={<SignUp />} />

      {/* ✅ 로그인 후 접근 가능한 경로들 (보호된 라우트) */}
      <Route
        path="/swings/home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/swings/mypage"
        element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/swings/mypage/update"
        element={
          <PrivateRoute>
            <UpdateForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/swings/mypage/passwordchange"
        element={
          <PrivateRoute>
            <PasswordChangeForm />
          </PrivateRoute>
        }
      />
      <Route
        path="/swings/mypage/userdelete"
        element={
          <PrivateRoute>
            <DeleteUser />
          </PrivateRoute>
        }
      />

      //관리자 페이지
      <Route
        path="/swings/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
            <Route
        path="/swings/admin/users"
        element={
          <PrivateRoute>
            <AdminUserList />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
