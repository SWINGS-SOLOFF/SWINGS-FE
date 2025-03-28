import { motion } from "framer-motion";

export default function SignupStep2({ formData, onChange, onNext }) {
  const handleSelect = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        추가 정보
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        성별, MBTI, 직업, 지역을 알려주세요
      </p>

      <div className="space-y-4">
        <select
          name="gender"
          value={formData.gender}
          onChange={handleSelect}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">성별</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>

        <input
          name="mbti"
          value={formData.mbti}
          onChange={(e) => onChange("mbti", e.target.value)}
          placeholder="MBTI"
          className="w-full p-2 border rounded text-black"
        />

        <input
          name="job"
          value={formData.job}
          onChange={(e) => onChange("job", e.target.value)}
          placeholder="직업"
          className="w-full p-2 border rounded text-black"
        />

        <select
          name="activityRegion"
          value={formData.activityRegion}
          onChange={handleSelect}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">지역 선택</option>
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

      <button
        onClick={onNext}
        className="w-full bg-gray-800 text-white py-2 rounded mt-6"
      >
        다음
      </button>
    </motion.div>
  );
}
