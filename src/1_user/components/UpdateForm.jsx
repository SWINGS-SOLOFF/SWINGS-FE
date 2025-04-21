import { useEffect, useState } from "react";
import { fetchUserData, updateUserInfo, checkUsername } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/userUtils";
import Select from "react-select";
import { Dialog } from "@headlessui/react";

const regionMap = {
  서울: "SEOUL",
  부산: "BUSAN",
  대구: "DAEGU",
  인천: "INCHEON",
  광주: "GWANGJU",
  대전: "DAEJEON",
  울산: "ULSAN",
  세종: "SEJONG",
  경기: "GYEONGGI",
  강원: "GANGWON",
  충북: "CHUNGBUK",
  충남: "CHUNGNAM",
  전북: "JEONBUK",
  전남: "JEONNAM",
  경북: "GYEONGBUK",
  경남: "GYEONGNAM",
  제주: "JEJU",
};

const regionOptions = Object.keys(regionMap).map((k) => ({
  label: k,
  value: k,
}));
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
  const [modal, setModal] = useState({
    open: false,
    success: true,
    message: "",
    logout: false,
  });
  const [loading, setLoading] = useState(true);
  const [usernameChecked, setUsernameChecked] = useState(true);
  const [usernameMsg, setUsernameMsg] = useState("");
  const [logoutPending, setLogoutPending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserData();
        const regionKor = Object.keys(regionMap).find(
          (k) => regionMap[k] === data.activityRegion
        );
        setFormData({ ...data, activityRegion: regionKor || "" });
        setOriginalData({ ...data, activityRegion: regionKor || "" });
      } catch {
        setModal({
          open: true,
          success: false,
          message: "사용자 정보를 불러올 수 없습니다.",
        });
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // ✅ 로그아웃 후 강제 이동 (토큰 제거 + 새로고침 포함)
  useEffect(() => {
    if (logoutPending) {
      removeToken();
      window.location.href = "/swings";
    }
  }, [logoutPending]);

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
    if (!formData || !formData.username)
      return setModal({
        open: true,
        success: false,
        message: "사용자 정보가 없습니다.",
      });

    if (formData.username !== originalData.username && !usernameChecked)
      return setModal({
        open: true,
        success: false,
        message: "아이디 중복 확인이 필요합니다.",
      });

    const updatedFields = {};
    for (const key in formData) {
      if (formData[key] !== originalData[key] && formData[key] !== undefined) {
        updatedFields[key] = formData[key];
      }
    }

    if (
      updatedFields.activityRegion &&
      regionMap[updatedFields.activityRegion]
    ) {
      updatedFields.activityRegion = regionMap[updatedFields.activityRegion];
    }

    if (Object.keys(updatedFields).length === 0) {
      return setModal({
        open: true,
        success: false,
        message: "변경된 항목이 없습니다.",
      });
    }

    try {
      await updateUserInfo(originalData.username, updatedFields);
      if (updatedFields.username) {
        setModal({
          open: true,
          success: true,
          message: "아이디가 변경되어 다시 로그인해야 합니다.",
          logout: true,
        });
      } else {
        setModal({
          open: true,
          success: true,
          message: "회원정보가 성공적으로 수정되었습니다!",
          logout: false,
        });
        setOriginalData({ ...formData });
      }
    } catch (err) {
      setModal({
        open: true,
        success: false,
        message: "수정 중 오류가 발생했습니다.",
        logout: false,
      });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        로딩 중...
      </div>
    );
  if (!formData) return null;

  return (
    <div className="relative min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <br />
      <div className="w-full max-w-sm space-y-6">
        {/* 아이디 필드 */}
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
              className="bg-custom-pink font-bold text-white px-3 py-1 rounded-2xl text-sm"
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

        {/* 필드들 */}

        <InputField
          label="생년월일"
          type="date"
          value={formData.birthDate}
          onChange={(v) => setFormData({ ...formData, birthDate: v })}
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

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/swings/mypage")}
            className="flex-1 bg-gray-200 text-gray-800 font-bold py-2 rounded-xl mt-2"
          >
            취소
          </button>
          <button
            onClick={handleUpdate}
            className="flex-1 bg-custom-pink font-bold text-white py-2 rounded-xl mt-2"
          >
            수정 완료
          </button>
        </div>
        <br />
      </div>

      <ResultModal
        modal={modal}
        onClose={() => {
          if (modal.success && modal.logout) {
            setLogoutPending(true); // ✅ logout 플래그를 통해 useEffect에서 로그아웃 처리
          } else if (modal.success) {
            navigate("/swings/mypage");
          } else {
            setModal({ ...modal, open: false });
          }
        }}
      />
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
        placeholder="선택"
      />
    </div>
  );
}

function ResultModal({ modal, onClose }) {
  return (
    <Dialog open={modal.open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center px-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm text-center space-y-4">
          <Dialog.Title
            className={`text-lg font-semibold ${
              modal.success ? "text-green-600" : "text-red-500"
            }`}
          >
            {modal.success ? " " : "❌ 실패"}
          </Dialog.Title>
          <p className="text-gray-700 text-sm whitespace-pre-line font-bold">
            {modal.message}
          </p>
          <button
            onClick={onClose}
            className="bg-custom-pink text-white px-4 py-2 rounded-xl font-bold"
          >
            확인
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
