import Select from "react-select";

export default function SignupStep2({ formData, updateData }) {
  const genderOptions = [
    { value: "male", label: "남성" },
    { value: "female", label: "여성" },
  ];

  const customSelectStyles = {
    container: (base) => ({
      ...base,
      width: "100%",
    }),
    menu: (base) => ({
      ...base,
      maxHeight: "150px",
      overflowY: "auto",
      color: "#000",
    }),
    control: (base) => ({
      ...base,
      padding: "2px",
      borderColor: "#D1D5DB",
      borderRadius: "0.5rem",
    }),
  };

  return (
    <div className="w-full px-4">
      <div className="w-full max-w-md mx-auto space-y-5">
        {/* 성별 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            성별
          </label>
          <Select
            options={genderOptions}
            value={genderOptions.find((opt) => opt.value === formData.gender)}
            onChange={(selected) => updateData({ gender: selected.value })}
            placeholder="성별 선택"
            styles={customSelectStyles}
          />
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            생년월일
          </label>
          <input
            type="date"
            value={formData.birthDate || ""}
            onChange={(e) => updateData({ birthDate: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
          />
        </div>

        {/* 전화번호 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            전화번호
          </label>
          <input
            type="text"
            value={formData.phonenumber || ""}
            onChange={(e) => updateData({ phonenumber: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
            placeholder="010xxxxxxxx"
          />
        </div>
      </div>
    </div>
  );
}
