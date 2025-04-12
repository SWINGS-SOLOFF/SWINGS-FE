import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest, googleLoginRequest } from "../api/userApi";
import { saveToken } from "../utils/userUtils";
import { motion, AnimatePresence } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { useGoogleLogin } from "@react-oauth/google";
import SakuraFall from "../components/SakuraFall";

const fadeDrop = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1 },
  }),
};

export default function StartLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: localStorage.getItem("savedUsername") || "",
    password: "",
  });

  const [saveId, setSaveId] = useState(!!localStorage.getItem("savedUsername"));
  const [errorMessage, setErrorMessage] = useState("");

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        const result = await googleLoginRequest(accessToken);
        if (result.accessToken) {
          login(result.accessToken);
          saveToken(result.accessToken);
          const decoded = jwtDecode(result.accessToken);
          navigate(decoded.role === "admin" ? "/swings/admin" : "/swings/feed");
        } else if (result.isNew) {
          navigate("/swings/signup", {
            state: { email: result.email, name: result.name },
          });
        }
      } catch (err) {
        console.error("Google 로그인 실패", err);
        setErrorMessage("Google 로그인 실패");
      }
    },
    onError: () => setErrorMessage("Google 로그인 실패"),
    scope: "openid profile email",
    flow: "implicit",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const accessToken = await loginRequest(formData);
      login(accessToken);
      saveToken(accessToken);

      const decoded = jwtDecode(accessToken);
      const role = decoded.role;

      if (saveId) localStorage.setItem("savedUsername", formData.username);
      else localStorage.removeItem("savedUsername");

      navigate(role === "admin" ? "/swings/admin" : "/swings/feed");
    } catch (error) {
      setErrorMessage(error.message || "로그인 중 오류 발생");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 flex items-center justify-center relative overflow-hidden px-4">
      <SakuraFall />
      <AnimatePresence>
        <motion.div
          variants={fadeDrop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm space-y-6 text-center z-10"
        >
          <motion.h1
            className="text-4xl font-bold text-gray-800"
            custom={0}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            SWINGS
          </motion.h1>
          <motion.p
            className="text-gray-600 animate-bounce"
            custom={1}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            나랑 골프치러 갈래?
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4 text-left"
            initial="hidden"
            animate="visible"
          >
            <motion.input
              custom={2}
              variants={itemVariants}
              type="text"
              placeholder="아이디"
              className="w-full border p-2 rounded text-black"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
            <motion.input
              custom={3}
              variants={itemVariants}
              type="password"
              placeholder="비밀번호"
              className="w-full border p-2 rounded text-black"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            <motion.div
              className="flex justify-between items-center text-sm text-gray-600 mt-1"
              custom={4}
              variants={itemVariants}
            >
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={saveId}
                  onChange={(e) => setSaveId(e.target.checked)}
                  className="mr-2"
                />
                아이디 저장
              </label>
              <button
                type="button"
                className="text-blue-500 hover:underline"
                onClick={() => navigate("/swings/find-password")}
              >
                비밀번호 찾기
              </button>
            </motion.div>

            <motion.button
              type="submit"
              custom={5}
              variants={itemVariants}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-lg shadow"
            >
              로그인
            </motion.button>
          </motion.form>

          <motion.div
            className="flex items-center my-4"
            custom={6}
            variants={itemVariants}
          >
            <div className="flex-grow h-px bg-gray-300" />
            <span className="px-3 text-gray-400 text-sm">또는</span>
            <div className="flex-grow h-px bg-gray-300" />
          </motion.div>

          <motion.button
            onClick={() => googleLogin()}
            custom={7}
            variants={itemVariants}
            className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg py-2 text-gray-700 font-medium hover:shadow"
          >
            <img
              src="https://developers.google.com/identity/images/g-logo.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Google로 로그인
          </motion.button>

          <motion.button
            onClick={() => navigate("/swings/signup")}
            custom={8}
            variants={itemVariants}
            className="w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg"
          >
            회원가입
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* 에러 모달 */}
      {errorMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-40 backdrop-blur-sm" />
          <div className="relative bg-white rounded-xl p-6 w-80 shadow-lg text-center space-y-4 animate-fadeIn z-50">
            <h2 className="text-lg font-semibold text-gray-800">로그인 실패</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {errorMessage}
            </p>
            <button
              onClick={() => setErrorMessage("")}
              className="mt-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
