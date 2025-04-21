import { useEffect, useState } from "react";
import Select from "react-select";

export default function SignupStep2({ formData, updateData }) {
  const genderOptions = [
    { value: "male", label: "남성" },
    { value: "female", label: "여성" },
  ];

  const baseSelectStyles = {
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

  const yearSelectStyles = {
    ...baseSelectStyles,
    container: (base) => ({
      ...base,
      width: "44%", // 약간 넓게
    }),
  };

  const monthDaySelectStyles = {
    ...baseSelectStyles,
    container: (base) => ({
      ...base,
      width: "28%", // 약간 좁게
    }),
  };

  const genderSelectStyles = {
    ...baseSelectStyles,
    container: (base) => ({
      ...base,
      width: "100%",
    }),
  };

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDate = today.getDate();

  const yearOptions = Array.from({ length: 100 }, (_, i) => {
    const year = currentYear - i;
    return { value: `${year}`, label: `${year}년` };
  });

  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const isFutureMonth =
      parseInt(formData.birthYear) === currentYear && month > currentMonth;
    return isFutureMonth
      ? null
      : { value: `${month}`.padStart(2, "0"), label: `${month}월` };
  }).filter(Boolean);

  const getMaxDay = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const maxDay = getMaxDay(formData.birthYear, formData.birthMonth);
  const dayOptions = Array.from({ length: maxDay || 31 }, (_, i) => {
    const day = i + 1;
    const isFutureDay =
      parseInt(formData.birthYear) === currentYear &&
      parseInt(formData.birthMonth) === currentMonth &&
      day > currentDate;
    return isFutureDay
      ? null
      : { value: `${day}`.padStart(2, "0"), label: `${day}일` };
  }).filter(Boolean);

  const handleBirthDateChange = (key, value) => {
    const updated = {
      ...formData,
      [key]: value,
    };

    const { birthYear, birthMonth, birthDay } = updated;

    if (birthYear && birthMonth && birthDay) {
      updated.birthDate = `${birthYear}-${birthMonth}-${birthDay}`;
    } else {
      updated.birthDate = "";
    }

    updateData(updated);
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
            styles={genderSelectStyles}
          />
        </div>

        {/* 생년월일 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            생년월일
          </label>
          <div className="flex gap-2">
            <Select
              options={yearOptions}
              value={
                formData.birthYear
                  ? yearOptions.find((y) => y.value === formData.birthYear)
                  : null
              }
              onChange={(e) => handleBirthDateChange("birthYear", e.value)}
              placeholder="년"
              styles={yearSelectStyles}
            />
            <Select
              options={monthOptions}
              value={
                formData.birthMonth
                  ? monthOptions.find((m) => m.value === formData.birthMonth)
                  : null
              }
              onChange={(e) => handleBirthDateChange("birthMonth", e.value)}
              placeholder="월"
              styles={monthDaySelectStyles}
            />
            <Select
              options={dayOptions}
              value={
                formData.birthDay
                  ? dayOptions.find((d) => d.value === formData.birthDay)
                  : null
              }
              onChange={(e) => handleBirthDateChange("birthDay", e.value)}
              placeholder="일"
              styles={monthDaySelectStyles}
            />
          </div>
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
          />
        </div>
      </div>
    </div>
  );
}
