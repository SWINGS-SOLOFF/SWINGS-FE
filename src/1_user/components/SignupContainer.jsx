import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";
import SignupStep4 from "./SignupStep4";
import SignupStep5 from "./SignupStep5";
import { signupUser } from "../api/userApi";

const steps = [SignupStep1, SignupStep2, SignupStep3, SignupStep4, SignupStep5];

export default function SignupContainer() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const updateData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const formDataPerStep = [
    {
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      email: "",
    },
    { gender: "", birthDate: "", phonenumber: "" },
    { mbti: "", job: "", activityRegion: "" },
    { hobbies: "", religion: "", smoking: "", drinking: "" },
    { golfSkill: "", introduce: "" },
  ];

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
    console.log("📦 회원가입 전송 데이터:", formData);
    try {
      await signupUser(formData);
      alert("회원가입이 완료되었습니다!");
      navigate("/swings");
    } catch (err) {
      console.error(err);
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  const CurrentStep = steps[step];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4">
      <button
        className="absolute top-4 left-4 text-sm text-gray-400 hover:text-gray-600"
        onClick={() => navigate("/swings")}
      >
        ← 로그인
      </button>

      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-wide text-center">
          SWINGS
        </h1>
        <p className="text-sm text-gray-500 mb-4 text-center">
          골프 동반자를 찾아보세요
        </p>

        {/* 진행률 바 + 텍스트 */}
        <div className="w-full mb-6">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            className="bg-pink-500 h-2.5 rounded-full"
          />
          <p className="text-center text-xs text-gray-400 mt-1">
            {step + 1} / {steps.length}
          </p>
        </div>

        {/* 폼 컨텐츠 */}
        <div className="space-y-6">
          <CurrentStep formData={formData} updateData={updateData} />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex justify-between pt-4">
            {step > 0 ? (
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded font-semibold"
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
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="ml-auto px-6 py-2 bg-purple-600 text-white rounded font-semibold"
              >
                회원가입 완료
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
