import { useState } from "react";
import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    phonenumber: "",
    gender: "",
    job: "",
    golfSkill: "",
    mbti: "",
    hobbies: "",
    religion: "",
    smoking: "",
    drinking: "",
    introduce: "",
    userImg: "",
  });

  const submitForm = async () => {
    try {
      const response = await fetch("http://localhost:8090/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("회원가입 성공!");
      } else {
        alert("회원가입 실패!");
      }
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error);
    }
  };

  return step === 1 ? (
    <StepOne
      formData={formData}
      setFormData={setFormData}
      nextStep={() => setStep(2)}
    />
  ) : (
    <StepTwo
      formData={formData}
      setFormData={setFormData}
      prevStep={() => setStep(1)}
      submitForm={submitForm}
    />
  );
};

export default SignUp;
