// src/1_user/routes/UserRoutes.jsx
import { Routes, Route } from "react-router-dom";
import MyPage from "../pages/MyPage";
import UpdateForm from "../components/UpdateForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import PrivateRoute from "../components/PrivateRoute";
import MyPointPage from "../pages/MyPointPage";
import PointCharge from "../pages/PointCharge";
import TossSuccess from "../pages/TossSuccess";
import TossFail from "../pages/TossFail";
import TossCheckout from "../pages/TossCheckout";
import DeleteUserModal from "../components/DeleteUserModal";
import ProfileImage from "../pages/ProfileImage";
import FeedPage from "../../2_feed/pages/FeedPage";

export default function UserRoutes() {
  return (
    <Routes>
      {/* 홈 */}
      <Route
        path="feed"
        element={
          <PrivateRoute>
            <FeedPage />
          </PrivateRoute>
        }
      />

      {/* 마이페이지 */}
      <Route
        path="mypage"
        element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        }
      />
      {/* 프로필 사진 수정 */}
      <Route
        path="mypage/profileImage"
        element={
          <PrivateRoute>
            <ProfileImage />
          </PrivateRoute>
        }
      />

      {/* 마이페이지 - 포인트 관리 */}
      <Route
        path="points"
        element={
          <PrivateRoute>
            <MyPointPage />
          </PrivateRoute>
        }
      />

      {/* 포인트 충전 페이지 (코인 선택 + 모달) ✅ */}
      <Route
        path="shop"
        element={
          <PrivateRoute>
            <PointCharge />
          </PrivateRoute>
        }
      />
      {/* 포인트 충전 토스 SDK 열기 */}
      <Route
        path="mypage/points/checkout"
        element={
          <PrivateRoute>
            <TossCheckout />
          </PrivateRoute>
        }
      />

      {/* 포인트 충전 완료 (토스 success callback) */}
      <Route
        path="mypage/points/success"
        element={
          <PrivateRoute>
            <TossSuccess />
          </PrivateRoute>
        }
      />

      {/* 포인트 충전 실패 */}
      <Route
        path="mypage/points/fail"
        element={
          <PrivateRoute>
            <TossFail />
          </PrivateRoute>
        }
      />

      {/* 회원정보 수정 */}
      <Route
        path="mypage/update"
        element={
          <PrivateRoute>
            <UpdateForm />
          </PrivateRoute>
        }
      />

      {/* 비밀번호 변경 */}
      <Route
        path="mypage/passwordchange"
        element={
          <PrivateRoute>
            <PasswordChangeForm />
          </PrivateRoute>
        }
      />

      {/* 회원탈퇴 */}
      <Route
        path="mypage/userdelete"
        element={
          <PrivateRoute>
            <DeleteUserModal />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
