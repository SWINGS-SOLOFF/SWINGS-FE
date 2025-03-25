import { useState } from "react";
import StepOne from "../components/StepOne";
import StepTwo from "../components/StepTwo";
import { signupUser } from "../api/userApi";

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
    await signupUser(formData);
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
