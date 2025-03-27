import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import MyPage from "../pages/MyPage";
import AuthScreen from "../pages/AuthScreen";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/swings" element={<AuthScreen />} />
      <Route path="/swings/home" element={<Home />} />
      <Route path="/swings/login" element={<Login />} />
      <Route path="/swings/signup" element={<SignUp />} />
      <Route path="/swings/mypage" element={<MyPage />} />
    </Routes>
  );
}
