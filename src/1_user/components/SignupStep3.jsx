import Select from "react-select";

export default function SignupStep3({ formData, updateData }) {
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
  ].map((type) => ({ label: type, value: type }));

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

  const customSelectStyles = {
    container: (base) => ({
      ...base,
      width: "100%",
    }),
    control: (base) => ({
      ...base,
      paddingTop: "2px",
      paddingBottom: "2px",
      paddingLeft: "12px",
      paddingRight: "12px",
      borderColor: "#D1D5DB", // Tailwind border-gray-300
      borderRadius: "0.5rem",
      minHeight: "42px",
      boxShadow: "none",
    }),
    menu: (base) => ({
      ...base,
      maxHeight: "150px",
      overflowY: "auto",
      color: "#000",
      zIndex: 9999,
    }),
  };

  return (
    <div className="w-full px-4">
      <div className="w-full max-w-sm mx-auto space-y-5">
        {/* MBTI */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            MBTI
          </label>
          <Select
            options={mbtiOptions}
            value={mbtiOptions.find((opt) => opt.value === formData.mbti)}
            onChange={(selected) => updateData({ mbti: selected.value })}
            placeholder="MBTI 선택"
            styles={customSelectStyles}
          />
        </div>

        {/* 직업 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            직업
          </label>
          <input
            type="text"
            value={formData.job || ""}
            onChange={(e) => updateData({ job: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
            placeholder="직업"
          />
        </div>

        {/* 활동 지역 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            활동 지역
          </label>
          <Select
            options={regionOptions}
            value={regionOptions.find(
              (opt) => opt.value === formData.activityRegion
            )}
            onChange={(selected) =>
              updateData({ activityRegion: selected.value })
            }
            placeholder="활동 지역 선택"
            styles={customSelectStyles}
          />
        </div>
      </div>
    </div>
  );
}
