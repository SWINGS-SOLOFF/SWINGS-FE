import { Routes, Route } from "react-router-dom";
import SignUp from "../pages/SignUp";
import Home from "../pages/Home"; // 예시: 홈 화면
import Login from "../pages/Login"; // 예시: 로그인 화면

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AppRoutes;
