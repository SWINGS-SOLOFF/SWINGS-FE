import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import MyPage from "../pages/MyPage";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
}
