import { useEffect, useState } from "react";
import { fetchUserData, updateUserInfo } from "../api/userApi";
import { checkUsername } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/userUtils";

const regionOptions = [
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
];

export default function UpdateForm() {
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [usernameChecked, setUsernameChecked] = useState(true);
  const [usernameMsg, setUsernameMsg] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserData();
        setFormData(data);
        setOriginalData(data);
      } catch (err) {
        console.error("유저 정보 조회 실패:", err);
        setErrorMsg("사용자 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleUsernameCheck = async () => {
    if (!formData?.username) return;

    if (formData.username === originalData.username) {
      setUsernameChecked(true);
      setUsernameMsg("현재 사용 중인 아이디입니다.");
      return;
    }

    try {
      const exists = await checkUsername(formData.username);
      if (exists) {
        setUsernameChecked(false);
        setUsernameMsg("이미 사용 중인 아이디입니다.");
      } else {
        setUsernameChecked(true);
        setUsernameMsg("사용 가능한 아이디입니다.");
      }
    } catch {
      setUsernameMsg("중복 확인 중 오류 발생");
      setUsernameChecked(false);
    }
  };

  const handleUpdate = async () => {
    if (!formData || !formData.username) {
      setErrorMsg("사용자 정보가 없습니다.");
      return;
    }

    if (formData.username !== originalData.username && !usernameChecked) {
      setErrorMsg("아이디 중복 확인이 필요합니다.");
      return;
    }

    const updatedFields = {};
    for (const key in formData) {
      if (formData[key] !== originalData[key] && formData[key] !== undefined) {
        updatedFields[key] = formData[key];
      }
    }

    if (Object.keys(updatedFields).length === 0) {
      setErrorMsg("변경된 항목이 없습니다.");
      setSuccessMsg("");
      return;
    }

    try {
      await updateUserInfo(originalData.username, updatedFields);
      setErrorMsg("");

      if (updatedFields.username) {
        alert("아이디가 변경되어 다시 로그인해야 합니다.");
        removeToken();
        navigate("/swings");
      } else {
        setSuccessMsg("✅ 회원정보가 성공적으로 수정되었습니다!");
        setOriginalData({ ...formData });
      }
    } catch (err) {
      console.error("회원정보 수정 실패:", err);
      setSuccessMsg("");
      setErrorMsg("❌ 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        로딩 중...
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-[#2E384D] text-center">
          회원정보 수정
        </h2>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            아이디
          </label>
          <div className="flex gap-2">
            <input
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-black"
              value={formData.username || ""}
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value });
                setUsernameChecked(false);
                setUsernameMsg("");
              }}
              placeholder="아이디 입력"
            />
            <button
              onClick={handleUsernameCheck}
              className="bg-blue-500 text-white px-3 rounded"
            >
              중복 확인
            </button>
          </div>
          {usernameMsg && (
            <p
              className={`text-sm mt-1 ${
                usernameChecked ? "text-green-600" : "text-red-500"
              }`}
            >
              {usernameMsg}
            </p>
          )}
        </div>

        <InputField
          label="전화번호"
          value={formData.phonenumber}
          onChange={(v) => setFormData({ ...formData, phonenumber: v })}
          placeholder="010xxxxxxxx"
        />

        <SelectField
          label="성별"
          value={formData.gender}
          onChange={(v) => setFormData({ ...formData, gender: v })}
          options={[
            { label: "남성", value: "남성" },
            { label: "여성", value: "여성" },
          ]}
        />

        <InputField
          label="직업"
          value={formData.job}
          onChange={(v) => setFormData({ ...formData, job: v })}
          placeholder="예: 개발자, 학생"
        />

        <SelectField
          label="골프 실력"
          value={formData.golfSkill}
          onChange={(v) => setFormData({ ...formData, golfSkill: v })}
          options={[
            { label: "초급", value: "초급" },
            { label: "중급", value: "중급" },
            { label: "고급", value: "고급" },
          ]}
        />

        <InputField
          label="MBTI"
          value={formData.mbti}
          onChange={(v) => setFormData({ ...formData, mbti: v })}
          placeholder="예: INFP"
        />

        <InputField
          label="취미"
          value={formData.hobbies}
          onChange={(v) => setFormData({ ...formData, hobbies: v })}
          placeholder="예: 등산, 게임"
        />

        <SelectField
          label="활동 지역"
          value={formData.activityRegion}
          onChange={(v) => setFormData({ ...formData, activityRegion: v })}
          options={regionOptions}
        />

        <SelectField
          label="종교"
          value={formData.religion}
          onChange={(v) => setFormData({ ...formData, religion: v })}
          options={[
            { label: "무교", value: "무교" },
            { label: "기독교", value: "기독교" },
            { label: "천주교", value: "천주교" },
            { label: "불교", value: "불교" },
            { label: "기타", value: "기타" },
          ]}
        />

        <SelectField
          label="흡연 여부"
          value={formData.smoking}
          onChange={(v) => setFormData({ ...formData, smoking: v })}
          options={[
            { label: "흡연함", value: "흡연함" },
            { label: "흡연하지 않음", value: "흡연하지 않음" },
          ]}
        />

        <SelectField
          label="음주 여부"
          value={formData.drinking}
          onChange={(v) => setFormData({ ...formData, drinking: v })}
          options={[
            { label: "음주함", value: "음주함" },
            { label: "음주하지 않음", value: "음주하지 않음" },
          ]}
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-[#2E384D] hover:bg-[#1f2c3a] text-white font-semibold py-2 rounded-lg mt-2"
        >
          수정 완료
        </button>

        {successMsg && (
          <p className="text-green-600 text-sm text-center">{successMsg}</p>
        )}
        {errorMsg && (
          <p className="text-red-500 text-sm text-center">{errorMsg}</p>
        )}
      </div>
    </div>
  );
}

// 🔹 공통 컴포넌트들
function InputField({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <select
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {!value && (
          <option value="" disabled hidden>
            -- 선택해주세요 --
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
