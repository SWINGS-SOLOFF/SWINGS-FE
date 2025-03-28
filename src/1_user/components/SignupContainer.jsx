import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";
import SignupStep4 from "./SignupStep4";
import { signupUser } from "../api/userApi"; // 🔥 회원가입 API 추가

const steps = [SignupStep1, SignupStep2, SignupStep3, SignupStep4];

export default function SignupContainer() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const updateData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    const currentStepFields = Object.keys(formDataPerStep[step]);
    const hasEmpty = currentStepFields.some(
      (field) => !formData[field] || formData[field].trim() === ""
    );
    if (hasEmpty) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    setError("");
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await signupUser(formData); // 🔥 API 호출
      alert("회원가입이 완료되었습니다!");
      navigate("/swings"); // 로그인 페이지로 이동
    } catch (e) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const formDataPerStep = [
    {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      phonenumber: "",
    },
    { gender: "", mbti: "", job: "", activityRegion: "" },
    { hobbies: "", religion: "", smoking: "", drinking: "" },
    { golfSkill: "", introduce: "" },
  ];

  const CurrentStep = steps[step];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <button
        className="absolute top-4 left-4 text-sm text-gray-400 hover:text-gray-600"
        onClick={() => navigate("/swings")}
      >
        ← 로그인으로 돌아가기
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-2">SWINGS</h1>
      <p className="text-sm text-gray-500 mb-6">골프 동반자를 찾아보세요</p>

      <div className="w-full max-w-md space-y-6">
        <CurrentStep formData={formData} updateData={updateData} />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <div className="flex justify-between pt-2">
          {step > 0 ? (
            <button
              onClick={prevStep}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold"
              disabled={loading}
            >
              이전
            </button>
          ) : (
            <div />
          )}

          {step < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="ml-auto px-6 py-2 bg-pink-500 text-white rounded font-semibold"
              disabled={loading}
            >
              다음
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="ml-auto px-6 py-2 bg-purple-600 text-white rounded font-semibold"
              disabled={loading}
            >
              {loading ? "처리 중..." : "회원가입 완료"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
