export default function SignupStep4({ formData, updateData }) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        value={formData.hobbies || ""}
        onChange={(e) => updateData({ hobbies: e.target.value })}
        className="w-full border p-2 rounded text-black"
        placeholder="취미"
      />

      <select
        value={formData.religion || ""}
        onChange={(e) => updateData({ religion: e.target.value })}
        className="w-full border p-2 rounded text-black"
      >
        <option value="">종교 선택</option>
        <option value="none">무교</option>
        <option value="christian">기독교</option>
        <option value="catholic">천주교</option>
        <option value="buddhist">불교</option>
        <option value="etc">기타</option>
      </select>

      <select
        value={formData.smoking || ""}
        onChange={(e) => updateData({ smoking: e.target.value })}
        className="w-full border p-2 rounded text-black"
      >
        <option value="">흡연 여부</option>
        <option value="yes">흡연함</option>
        <option value="no">흡연하지 않음</option>
      </select>

      <select
        value={formData.drinking || ""}
        onChange={(e) => updateData({ drinking: e.target.value })}
        className="w-full border p-2 rounded text-black"
      >
        <option value="">음주 여부</option>
        <option value="yes">음주함</option>
        <option value="no">음주하지 않음</option>
      </select>
    </div>
  );
}
