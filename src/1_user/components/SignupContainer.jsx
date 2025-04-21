import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa"; // 🌟 스피너 아이콘 추가

import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";
import SignupStep4 from "./SignupStep4";
import SignupStep5 from "./SignupStep5";
import { signupUser } from "../api/userApi";
import { hasEmptyFields } from "../utils/userUtils";
import { IoIosArrowBack } from "react-icons/io";

const steps = [SignupStep1, SignupStep2, SignupStep3, SignupStep4, SignupStep5];

export default function SignupContainer() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const updateData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (hasEmptyFields(step, formData)) {
      setError("모든 항목을 입력해주세요.");
      return;
    }

    if (step === 0) {
      const usernameRegex = /^[A-Za-z0-9]+$/;
      if (!usernameRegex.test(formData.username)) {
        setError("아이디는 영문과 숫자만 사용 가능합니다.");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("이메일 형식이 올바르지 않습니다.");
        return;
      }
    }

    if (step === 1) {
      const phoneRegex = /^010\d{8}$/;
      if (!phoneRegex.test(formData.phonenumber)) {
        setError("전화번호 형식이 올바르지 않습니다.");
        return;
      }
    }

    setError("");
    setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    console.log("📦 회원가입 전송 데이터:", formData);
    try {
      await signupUser(formData);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const closeModalAndNavigate = () => {
    setShowSuccessModal(false);
    navigate("/swings");
  };

  const CurrentStep = steps[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-white to-blue-100 flex flex-col justify-center items-center px-4">
      <button
        className="absolute top-4 left-4 flex items-center gap-1 text-sm text-gray-700 hover:text-gray-600"
        onClick={() => navigate("/swings")}
      >
        <IoIosArrowBack className="text-lg" />
        로그인
      </button>

      <div className="w-full max-w-sm">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-wide text-center">
          SWINGS
        </h1>
        <p className="text-sm text-gray-500 mb-4 text-center">
          골프 메이트를 찾아보세요
        </p>

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

        <div className="space-y-6">
          <CurrentStep formData={formData} updateData={updateData} />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex justify-between pt-4">
            {step > 0 ? (
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-300 border-none outline-none text-gray-700 rounded font-semibold"
              >
                이전
              </button>
            ) : (
              <div />
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={nextStep}
                className="ml-auto px-6 py-2 border-none outline-none bg-custom-pink text-white rounded font-bold"
              >
                다음
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto px-6 py-2border-none outline-none  bg-custom-pink text-white rounded font-bold disabled:opacity-50"
              >
                {loading ? "처리 중..." : "회원가입"}
              </button>
            )}
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* 배경 오버레이 */}
          <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />

          {/* 모달 본문 */}
          <div className="relative bg-white px-6 py-6 rounded-2xl shadow-xl w-80 text-center space-y-4 animate-fadeIn">
            {/* 🎉 상단 텍스트 */}
            <h3 className="text-xl font-semibold text-gray-800">
              회원가입 완료!
            </h3>
            <p className="text-sm text-gray-600">
              이메일 인증 후 이용해 주세요.
            </p>

            {/* ✅ 확인 버튼 */}
            <button
              onClick={closeModalAndNavigate}
              className="bg-custom-pink hover:bg-pink-600 transition text-white px-5 py-2 rounded-full font-bold shadow-sm"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* ✅ 로딩 스피너 모달 */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
          <div className="bg-white px-6 py-6 rounded shadow-lg border text-center space-y-4">
            <FaSpinner className="text-pink-500 text-4xl animate-spin mx-auto" />
            <p className="text-lg font-semibold text-gray-800">
              회원가입 중입니다!
            </p>
            <p className="text-sm text-gray-500">잠시만 기다려주세요...</p>
          </div>
        </div>
      )}
    </div>
  );
}
