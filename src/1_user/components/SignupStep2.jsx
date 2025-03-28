export default function SignupStep2({ formData, updateData, nextStep }) {
  return (
    <div className="space-y-4">
      <select
        value={formData.gender || ""}
        onChange={(e) => updateData({ gender: e.target.value })}
        className="w-full border p-2 rounded text-black"
      >
        <option value="">성별 선택</option>
        <option value="male">남성</option>
        <option value="female">여성</option>
      </select>

      <input
        type="text"
        value={formData.mbti || ""}
        onChange={(e) => updateData({ mbti: e.target.value })}
        className="w-full border p-2 rounded text-black"
        placeholder="MBTI"
      />

      <input
        type="text"
        value={formData.job || ""}
        onChange={(e) => updateData({ job: e.target.value })}
        className="w-full border p-2 rounded text-black"
        placeholder="직업"
      />

      <select
        value={formData.activityRegion || ""}
        onChange={(e) => updateData({ activityRegion: e.target.value })}
        className="w-full border p-2 rounded text-black"
      >
        <option value="">거주 지역</option>
        {[
          "SEOUL",
          "BUSAN",
          "DAEGU",
          "INCHEON",
          "GWANGJU",
          "DAEJEON",
          "ULSAN",
          "SEJONG",
          "GYEONGGI",
          "GANGWON",
          "CHUNGBUK",
          "CHUNGNAM",
          "JEONBUK",
          "JEONNAM",
          "GYEONGBUK",
          "GYEONGNAM",
          "JEJU",
        ].map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
}
