import { useState } from "react";
import { motion } from "framer-motion";
import { checkUsername } from "../api/userApi";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    key: "gender",
    question: "성별이 어떻게 되시나요?",
    type: "select",
    options: [
      { label: "남성", value: "male" },
      { label: "여성", value: "female" },
    ],
  },
  { key: "name", question: "이름을 입력해주세요.", type: "text" },
  {
    key: "username",
    question: "사용하실 아이디를 입력해주세요.",
    type: "text",
  },
  { key: "password", question: "비밀번호를 입력해주세요.", type: "password" },
  {
    key: "confirmPassword",
    question: "비밀번호를 한 번 더 입력해주세요.",
    type: "password",
  },

  // ✅ 지역 선택 - 한글 표시 / Enum 전송
  {
    key: "activityRegion",
    question: "어느 지역에 거주하시나요?",
    type: "select",
    options: [
      { label: "서울", value: "SEOUL" },
      { label: "부산", value: "BUSAN" },
      { label: "대구", value: "DAEGU" },
      { label: "인천", value: "INCHEON" },
      { label: "광주", value: "GWANGJU" },
      { label: "대전", value: "DAEJEON" },
      { label: "울산", value: "ULSAN" },
      { label: "세종", value: "SEJONG" },
      { label: "경기", value: "GYEONGGI" },
      { label: "강원", value: "GANGWON" },
      { label: "충북", value: "CHUNGBUK" },
      { label: "충남", value: "CHUNGNAM" },
      { label: "전북", value: "JEONBUK" },
      { label: "전남", value: "JEONNAM" },
      { label: "경북", value: "GYEONGBUK" },
      { label: "경남", value: "GYEONGNAM" },
      { label: "제주", value: "JEJU" },
    ],
  },

  { key: "phonenumber", question: "전화번호를 입력해주세요.", type: "text" },
  { key: "job", question: "직업이 무엇인가요?", type: "text" },
  {
    key: "golfSkill",
    question: "골프 실력은 어느 정도인가요?",
    type: "select",
    options: [
      { label: "초급", value: "beginner" },
      { label: "중급", value: "intermediate" },
      { label: "고급", value: "advanced" },
    ],
  },
  { key: "mbti", question: "MBTI를 입력해주세요.", type: "text" },
  { key: "hobbies", question: "취미가 무엇인가요?", type: "text" },
  {
    key: "religion",
    question: "종교가 있으신가요?",
    type: "select",
    options: [
      { label: "무교", value: "none" },
      { label: "기독교", value: "christian" },
      { label: "천주교", value: "catholic" },
      { label: "불교", value: "buddhist" },
      { label: "기타", value: "etc" },
    ],
  },
  {
    key: "smoking",
    question: "흡연하시나요?",
    type: "select",
    options: [
      { label: "흡연함", value: "yes" },
      { label: "흡연하지 않음", value: "no" },
    ],
  },
  {
    key: "drinking",
    question: "음주하시나요?",
    type: "select",
    options: [
      { label: "음주함", value: "yes" },
      { label: "음주하지 않음", value: "no" },
    ],
  },
  { key: "introduce", question: "자기소개를 해주세요.", type: "textarea" },
];

export default function AnimatedSignupForm({ submitForm }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const current = questions[step];

  const handleNext = async (value) => {
    if (!value) return setError("입력해주세요.");

    if (current.key === "username") {
      const exists = await checkUsername(value);
      if (exists) return setError("이미 존재하는 아이디입니다.");
    }

    if (current.key === "confirmPassword") {
      if (formData.password !== value)
        return setError("비밀번호가 일치하지 않습니다.");
    }

    setFormData({ ...formData, [current.key]: value });
    setInput("");
    setError("");
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    try {
      await submitForm(formData);
      alert("회원가입이 완료되었습니다!");
      navigate("/swings");
    } catch (e) {
      setError("회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <button
        onClick={() => navigate("/swings")}
        className="absolute top-4 left-4 text-sm text-gray-400 hover:text-gray-600"
      >
        ← Login
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6"
      >
        {step < questions.length ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-bold mb-4 text-gray-700">
              {current.question}
            </h2>

            {current.type === "select" ? (
              <div className="flex flex-wrap justify-center gap-2">
                {current.options.map((opt) => {
                  const label = typeof opt === "string" ? opt : opt.label;
                  const value = typeof opt === "string" ? opt : opt.value;

                  return (
                    <button
                      key={value}
                      className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                      onClick={() => handleNext(value)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            ) : current.type === "textarea" ? (
              <>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full border p-2 rounded text-black"
                  placeholder="자유롭게 작성해주세요."
                  rows="4"
                />
                <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => handleNext(input)}
                >
                  다음
                </button>
              </>
            ) : (
              <>
                <input
                  type={current.type}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full border p-2 rounded text-black"
                  placeholder="입력해주세요..."
                />
                <button
                  className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                  onClick={() => handleNext(input)}
                >
                  다음
                </button>
              </>
            )}

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              모든 정보가 입력되었습니다!
            </h2>
            <button
              className="mt-4 px-6 py-2 bg-purple-600 text-white rounded"
              onClick={handleSubmit}
            >
              회원가입 완료
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
