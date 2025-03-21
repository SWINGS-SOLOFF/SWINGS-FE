import { useState } from "react";
import { useNavigate } from "react-router-dom";

const StepTwo = ({ formData, setFormData, prevStep }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  /** 🔹 이미지 파일을 Base64로 변환하여 저장 */
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, userImg: reader.result }); // Base64 데이터 저장
      setImagePreview(reader.result); // 미리보기용 상태 업데이트
    };
    reader.readAsDataURL(file);
  };

  /** 🔹 회원가입 요청 */
  const submitForm = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(
        "http://localhost:8090/swings/users/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            role: formData.role || "player", // 🔹 기본값 player 설정
          }),
        }
      );

      if (!response.ok) {
        throw new Error("회원가입 실패. 다시 시도해주세요.");
      }

      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 이동
    } catch (error) {
      console.error("회원가입 실패:", error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">회원가입 - Step 2</h2>

      {/* 직업 입력 */}
      <label className="block">
        직업:
        <input
          type="text"
          placeholder="현재 직업을 입력하세요"
          className="w-full border p-2 rounded text-black"
          value={formData.job}
          onChange={(e) => setFormData({ ...formData, job: e.target.value })}
        />
      </label>

      {/* 골프 실력 선택 */}
      <label className="block">
        골프 실력:
        <select
          className="w-full border p-2 rounded text-black"
          value={formData.golfSkill}
          onChange={(e) =>
            setFormData({ ...formData, golfSkill: e.target.value })
          }
        >
          <option value="">골프 실력을 선택하세요</option>
          <option value="beginner">초급</option>
          <option value="intermediate">중급</option>
          <option value="advanced">고급</option>
        </select>
      </label>

      {/* MBTI 입력 */}
      <label className="block">
        MBTI:
        <input
          type="text"
          placeholder="MBTI를 입력하세요 (예: INFP)"
          className="w-full border p-2 rounded text-black"
          value={formData.mbti}
          onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
        />
      </label>

      {/* 취미 입력 */}
      <label className="block">
        취미:
        <input
          type="text"
          placeholder="취미를 입력하세요 (예: 독서, 등산)"
          className="w-full border p-2 rounded text-black"
          value={formData.hobbies}
          onChange={(e) =>
            setFormData({ ...formData, hobbies: e.target.value })
          }
        />
      </label>
      {/* 종교 선택 */}
      <label className="block">
        종교:
        <select
          className="w-full border p-2 rounded text-black"
          value={formData.religion}
          onChange={(e) =>
            setFormData({ ...formData, religion: e.target.value })
          }
        >
          <option value="">종교를 선택하세요</option>
          <option value="none">무교</option>
          <option value="christian">기독교</option>
          <option value="catholic">천주교</option>
          <option value="buddhist">불교</option>
          <option value="etc">기타</option>
        </select>
      </label>

      {/* 흡연 여부 */}
      <label className="block">
        흡연 여부:
        <select
          className="w-full border p-2 rounded text-black"
          value={formData.smoking}
          onChange={(e) =>
            setFormData({ ...formData, smoking: e.target.value })
          }
        >
          <option value="">흡연 여부를 선택하세요</option>
          <option value="yes">흡연함</option>
          <option value="no">흡연하지 않음</option>
        </select>
      </label>

      {/* 음주 여부 */}
      <label className="block">
        음주 여부:
        <select
          className="w-full border p-2 rounded text-black"
          value={formData.drinking}
          onChange={(e) =>
            setFormData({ ...formData, drinking: e.target.value })
          }
        >
          <option value="">음주 여부를 선택하세요</option>
          <option value="yes">음주함</option>
          <option value="no">음주하지 않음</option>
        </select>
      </label>

      {/* 자기소개 */}
      <label className="block">
        자기소개:
        <textarea
          placeholder="자기소개를 입력하세요"
          className="w-full border p-2 rounded text-black"
          rows="3"
          value={formData.introduce}
          onChange={(e) =>
            setFormData({ ...formData, introduce: e.target.value })
          }
        />
      </label>

      {/* 프로필 이미지 업로드 */}
      <label className="block">
        프로필 이미지 업로드:
        <input
          type="file"
          accept="image/*"
          className="w-full border p-2 rounded"
          onChange={handleImageUpload}
        />
      </label>

      {/* 이미지 미리보기 */}
      {imagePreview && (
        <div className="mt-2">
          <p className="text-sm text-gray-600">미리보기:</p>
          <img
            src={imagePreview}
            alt="미리보기"
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      )}

      {/* 회원가입 실패 메시지 */}
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      {/* 이전 단계 버튼 */}
      <button
        onClick={prevStep}
        className="w-full bg-gray-500 text-white p-2 rounded"
      >
        이전 단계
      </button>

      {/* 회원가입 버튼 */}
      <button
        onClick={submitForm}
        className={`w-full text-white p-2 rounded mt-2 ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-500"
        }`}
        disabled={loading}
      >
        {loading ? "회원가입 중..." : "회원가입 완료"}
      </button>
    </div>
  );
};

export default StepTwo;
