import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toBase64 } from "../utils/userUtils";

const StepTwo = ({ formData, setFormData, prevStep, submitForm }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(formData.userImg || "");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const base64 = await toBase64(file);
      setFormData({ ...formData, userImg: base64 });
      setImagePreview(base64);
    } catch {
      setErrorMessage("이미지 업로드 실패");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await submitForm();
      setSuccessMessage(
        "✅ 회원가입이 완료되었습니다! 로그인 페이지로 이동합니다."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2000); // 1.5초 후 이동
    } catch (err) {
      setErrorMessage("회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">회원가입 - Step 2</h2>

      {/* ✅ 성공 메시지 출력 */}
      {successMessage && (
        <p className="text-green-600 font-semibold text-center">
          {successMessage}
        </p>
      )}

      <label className="block">
        직업:
        <input
          type="text"
          className="w-full border p-2 rounded text-black"
          placeholder="직업"
          value={formData.job}
          onChange={(e) => setFormData({ ...formData, job: e.target.value })}
        />
      </label>

      <label className="block">
        골프 실력:
        <select
          className="w-full border p-2 rounded text-black"
          value={formData.golfSkill}
          onChange={(e) =>
            setFormData({ ...formData, golfSkill: e.target.value })
          }
        >
          <option value="">선택</option>
          <option value="beginner">초급</option>
          <option value="intermediate">중급</option>
          <option value="advanced">고급</option>
        </select>
      </label>

      <label className="block">
        MBTI:
        <input
          type="text"
          className="w-full border p-2 rounded text-black"
          placeholder="MBTI"
          value={formData.mbti}
          onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
        />
      </label>

      <label className="block">
        취미:
        <input
          type="text"
          className="w-full border p-2 rounded text-black"
          placeholder="취미"
          value={formData.hobbies}
          onChange={(e) =>
            setFormData({ ...formData, hobbies: e.target.value })
          }
        />
      </label>

      <label className="block">
        종교:
        <select
          className="w-full border p-2 rounded text-black"
          value={formData.religion}
          onChange={(e) =>
            setFormData({ ...formData, religion: e.target.value })
          }
        >
          <option value="">선택</option>
          <option value="none">무교</option>
          <option value="christian">기독교</option>
          <option value="catholic">천주교</option>
          <option value="buddhist">불교</option>
          <option value="etc">기타</option>
        </select>
      </label>

      <label className="block">
        흡연 여부:
        <select
          className="w-full border p-2 rounded text-black"
          value={formData.smoking}
          onChange={(e) =>
            setFormData({ ...formData, smoking: e.target.value })
          }
        >
          <option value="">선택</option>
          <option value="yes">흡연함</option>
          <option value="no">흡연하지 않음</option>
        </select>
      </label>

      <label className="block">
        음주 여부:
        <select
          className="w-full border p-2 rounded text-black"
          value={formData.drinking}
          onChange={(e) =>
            setFormData({ ...formData, drinking: e.target.value })
          }
        >
          <option value="">선택</option>
          <option value="yes">음주함</option>
          <option value="no">음주하지 않음</option>
        </select>
      </label>

      <label className="block">
        자기소개:
        <textarea
          className="w-full border p-2 rounded text-black"
          placeholder="자기소개"
          rows="3"
          value={formData.introduce}
          onChange={(e) =>
            setFormData({ ...formData, introduce: e.target.value })
          }
        />
      </label>

      {/* <label className="block">
        프로필 이미지 업로드:
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>

      {imagePreview && (
        <img
          src={imagePreview}
          alt="미리보기"
          className="w-32 h-32 object-cover rounded"
        />
      )} */}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <div className="flex space-x-2">
        <button
          onClick={prevStep}
          className="w-1/2 bg-gray-500 text-white p-2 rounded"
        >
          이전
        </button>
        <button
          onClick={handleSubmit}
          className={`w-1/2 p-2 rounded ${
            loading ? "bg-gray-400" : "bg-green-500 text-white"
          }`}
          disabled={loading}
        >
          {loading ? "가입 중..." : "회원가입 완료"}
        </button>
      </div>
    </div>
  );
};

export default StepTwo;
