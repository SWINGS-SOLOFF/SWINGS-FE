import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import MyPage from "../pages/MyPage";
import AuthScreen from "../pages/AuthScreen";
import AnimatedSignupForm from "../components/AnimatedSignupForm";
import { signupUser } from "../api/userApi";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthScreen />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/mypage" element={<MyPage />} />
      <Route
        path="/signup"
        element={<AnimatedSignupForm submitForm={signupUser} />}
      />
    </Routes>
  );
}
