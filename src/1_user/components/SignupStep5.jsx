export default function SignupStep5({ formData, updateData }) {
  return (
    <div className="space-y-4">
      <select
        className="w-full border p-2 rounded text-black"
        value={formData.golfSkill || ""}
        onChange={(e) => updateData({ golfSkill: e.target.value })}
      >
        <option value="">골프 실력</option>
        <option value="beginner">초급</option>
        <option value="intermediate">중급</option>
        <option value="advanced">고급</option>
      </select>

      <textarea
        placeholder="자기소개"
        className="w-full border p-2 rounded text-black"
        rows="4"
        value={formData.introduce || ""}
        onChange={(e) => updateData({ introduce: e.target.value })}
      />
    </div>
  );
}
