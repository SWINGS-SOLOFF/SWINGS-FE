import React from "react";

export default function MyPageForm({ formData, handleChange, handleUpdate }) {
  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <label className="block">
        전화번호:
        <input
          type="text"
          name="phonenumber"
          value={formData.phonenumber || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        />
      </label>

      <label className="block">
        성별:
        <select
          name="gender"
          value={formData.gender || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        >
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>
      </label>

      <label className="block">
        직업:
        <input
          type="text"
          name="job"
          value={formData.job || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        />
      </label>

      <label className="block">
        골프 실력:
        <select
          name="golfSkill"
          value={formData.golfSkill || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        >
          <option value="beginner">초급</option>
          <option value="intermediate">중급</option>
          <option value="advanced">고급</option>
        </select>
      </label>

      <label className="block">
        MBTI:
        <input
          type="text"
          name="mbti"
          value={formData.mbti || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        />
      </label>

      <label className="block">
        취미:
        <input
          type="text"
          name="hobbies"
          value={formData.hobbies || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        />
      </label>

      <label className="block">
        종교:
        <select
          name="religion"
          value={formData.religion || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        >
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
          name="smoking"
          value={formData.smoking || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        >
          <option value="yes">흡연함</option>
          <option value="no">흡연하지 않음</option>
        </select>
      </label>

      <label className="block">
        음주 여부:
        <select
          name="drinking"
          value={formData.drinking || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        >
          <option value="yes">음주함</option>
          <option value="no">음주하지 않음</option>
        </select>
      </label>

      <label className="block">
        자기소개:
        <textarea
          name="introduce"
          value={formData.introduce || ""}
          onChange={handleChange}
          className="w-full border p-2 rounded text-black"
        />
      </label>

      <button
        type="submit"
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        수정 완료
      </button>
    </form>
  );
}
