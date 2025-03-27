import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import MyPage from "../pages/MyPage";
import AnimatedSignupForm from "../components/AnimatedSignupForm";
import { signupUser } from "../api/userApi";
import UpdateForm from "../components/UpdateForm";
import PasswordChangeForm from "../components/PasswordChangeForm";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/swings" element={<Login />} />
      <Route path="/swings/home" element={<Home />} />
      <Route path="/swings/signup" element={<SignUp />} />
      <Route path="/swings/mypage" element={<MyPage />} />
      <Route path="/swings/update" element={<UpdateForm />} />
      <Route path="/swings/passwordchange" element={<PasswordChangeForm />} />
    </Routes>
  );
}
