import { useState } from "react";
import SignupStep1 from "./SignupStep1";
import SignupStep2 from "./SignupStep2";
import SignupStep3 from "./SignupStep3";
import SignupStep4 from "./SignupStep4";

const steps = [SignupStep1, SignupStep2, SignupStep3, SignupStep4];

export default function SignupContainer() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const CurrentStep = steps[step];

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleSubmit = () => {
    console.log("최종 데이터:", formData);
    // 👉 submitForm(formData) API 연동 위치
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">SWINGS</h1>
          <p className="text-sm text-gray-500">골프 동반자를 찾아보세요</p>
        </div>

        <CurrentStep
          formData={formData}
          updateData={updateData}
          nextStep={nextStep}
          prevStep={prevStep}
          handleSubmit={handleSubmit}
        />

        <div className="flex justify-between pt-4">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="px-4 py-2 bg-gray-300 rounded font-medium text-gray-700"
            >
              이전
            </button>
          )}
          {step < steps.length - 1 && (
            <button
              onClick={nextStep}
              className="ml-auto px-4 py-2 bg-pink-300 text-white rounded font-semibold"
            >
              다음
            </button>
          )}
          {step === steps.length - 1 && (
            <button
              onClick={handleSubmit}
              className="ml-auto px-4 py-2 bg-purple-600 text-white rounded font-semibold"
            >
              회원가입 완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
