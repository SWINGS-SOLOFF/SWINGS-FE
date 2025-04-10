import { useEffect, useState } from "react";
import { fetchUserData, updateUserInfo, checkUsername } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/userUtils";
import Select from "react-select";
import { ArrowLeft } from "lucide-react";

const regionOptions = [
  "서울",
  "부산",
  "대구",
  "인천",
  "광주",
  "대전",
  "울산",
  "세종",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
].map((v) => ({ label: v, value: v.toUpperCase() }));

const mbtiOptions = [
  "ISTJ",
  "ISFJ",
  "INFJ",
  "INTJ",
  "ISTP",
  "ISFP",
  "INFP",
  "INTP",
  "ESTP",
  "ESFP",
  "ENFP",
  "ENTP",
  "ESTJ",
  "ESFJ",
  "ENFJ",
  "ENTJ",
].map((v) => ({ label: v, value: v }));

const genderOptions = [
  { label: "남성", value: "male" },
  { label: "여성", value: "female" },
];

const golfSkillOptions = [
  { label: "초급", value: "beginner" },
  { label: "중급", value: "intermediate" },
  { label: "고급", value: "advanced" },
];

const religionOptions = [
  { label: "무교", value: "none" },
  { label: "기독교", value: "christian" },
  { label: "천주교", value: "catholic" },
  { label: "불교", value: "buddhist" },
  { label: "기타", value: "etc" },
];

const yesNoOptions = [
  { label: "흡연함", value: "yes" },
  { label: "흡연하지 않음", value: "no" },
];

const drinkOptions = [
  { label: "음주함", value: "yes" },
  { label: "음주하지 않음", value: "no" },
];

const selectStyles = {
  menu: (base) => ({
    ...base,
    maxHeight: "150px",
    overflowY: "auto",
    color: "#000",
  }),
  control: (base) => ({
    ...base,
    borderColor: "#CBD5E0",
    borderRadius: "0.5rem",
    padding: "0.25rem 0.5rem",
    fontSize: "0.875rem",
  }),
};

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
      setUsernameChecked(!exists);
      setUsernameMsg(
        exists ? "이미 사용 중인 아이디입니다." : "사용 가능한 아이디입니다."
      );
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
      if (updatedFields.username) {
        alert("아이디가 변경되어 다시 로그인해야 합니다.");
        removeToken();
        navigate("/swings");
      } else {
        setSuccessMsg("✅ 회원정보가 성공적으로 수정되었습니다!");
        setOriginalData({ ...formData });
        setErrorMsg("");
      }
    } catch (err) {
      console.error("회원정보 수정 실패:", err);
      setSuccessMsg("");
      setErrorMsg("❌ 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  if (!formData)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        사용자 정보를 불러올 수 없습니다.
      </div>
    );

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 text-gray-500 hover:text-black transition-colors"
      >
        <ArrowLeft size={24} />
      </button>
      <div className="w-full max-w-sm space-y-6">
        <br />
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
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm"
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
          label="이메일"
          value={formData.email}
          onChange={(v) => setFormData({ ...formData, email: v })}
        />
        <InputField
          label="생년월일"
          type="date"
          value={formData.birthDate}
          onChange={(v) => setFormData({ ...formData, birthDate: v })}
        />
        <InputField
          label="전화번호"
          value={formData.phonenumber}
          onChange={(v) => setFormData({ ...formData, phonenumber: v })}
        />

        <LabeledSelect
          label="성별"
          options={genderOptions}
          value={formData.gender}
          onChange={(v) => setFormData({ ...formData, gender: v })}
        />
        <InputField
          label="직업"
          value={formData.job}
          onChange={(v) => setFormData({ ...formData, job: v })}
        />
        <LabeledSelect
          label="골프 실력"
          options={golfSkillOptions}
          value={formData.golfSkill}
          onChange={(v) => setFormData({ ...formData, golfSkill: v })}
        />
        <LabeledSelect
          label="MBTI"
          options={mbtiOptions}
          value={formData.mbti}
          onChange={(v) => setFormData({ ...formData, mbti: v })}
        />
        <InputField
          label="취미"
          value={formData.hobbies}
          onChange={(v) => setFormData({ ...formData, hobbies: v })}
        />
        <LabeledSelect
          label="활동 지역"
          options={regionOptions}
          value={formData.activityRegion}
          onChange={(v) => setFormData({ ...formData, activityRegion: v })}
        />
        <LabeledSelect
          label="종교"
          options={religionOptions}
          value={formData.religion}
          onChange={(v) => setFormData({ ...formData, religion: v })}
        />
        <LabeledSelect
          label="흡연 여부"
          options={yesNoOptions}
          value={formData.smoking}
          onChange={(v) => setFormData({ ...formData, smoking: v })}
        />
        <LabeledSelect
          label="음주 여부"
          options={drinkOptions}
          value={formData.drinking}
          onChange={(v) => setFormData({ ...formData, drinking: v })}
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg mt-2"
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
      <br />
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        type={type}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black text-sm"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function LabeledSelect({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <Select
        options={options}
        value={options.find((opt) => opt.value === value)}
        onChange={(selected) => onChange(selected.value)}
        styles={selectStyles}
        placeholder={`선택`}
      />
    </div>
  );
}
