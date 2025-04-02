// src/1_user/routes/UserRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import MyPage from "../pages/MyPage";
import UpdateForm from "../components/UpdateForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import DeleteUser from "../components/DeleteUser";
import PrivateRoute from "../components/PrivateRoute";
import MyPointPage from "../pages/MyPointPage";
import TossCheckout from "../pages/TossCheckout";
import TossSuccess from "../pages/TossSuccess";
import TossFail from "../pages/TossFail";

export default function UserRoutes() {
  return (
    <Routes>
      <Route
        path="home"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />

      <Route
        path="mypage"
        element={
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        }
      />
      <Route
        path="mypage/points"
        element={
          <PrivateRoute>
            <MyPointPage />
          </PrivateRoute>
        }
      />
      <Route
        path="mypage/update"
        element={
          <PrivateRoute>
            <UpdateForm />
          </PrivateRoute>
        }
      />
      <Route
        path="mypage/passwordchange"
        element={
          <PrivateRoute>
            <PasswordChangeForm />
          </PrivateRoute>
        }
      />
      <Route
        path="mypage/userdelete"
        element={
          <PrivateRoute>
            <DeleteUser />
          </PrivateRoute>
        }
      />

      {/*  토스 결제 관련 라우터 추가 */}
      <Route
        path="mypage/points/checkout"
        element={
          <PrivateRoute>
            <TossCheckout />
          </PrivateRoute>
        }
      />
      <Route
        path="mypage/points/success"
        element={
          <PrivateRoute>
            <TossSuccess />
          </PrivateRoute>
        }
      />
      <Route
        path="mypage/points/fail"
        element={
          <PrivateRoute>
            <TossFail />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
