// src/1_user/pages/SignUp.jsx
import AnimatedSignupForm from "../components/AnimatedSignupForm";
import { signupUser } from "../api/userApi"; // ✅ 경로 수정!
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const navigate = useNavigate();

  const submitForm = async (formData) => {
    await signupUser(formData);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <AnimatedSignupForm submitForm={submitForm} />
    </div>
  );
}
