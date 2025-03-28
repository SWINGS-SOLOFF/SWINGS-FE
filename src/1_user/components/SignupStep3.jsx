import { motion } from "framer-motion";

export default function SignupStep3({ formData, onChange, onNext }) {
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
      <h2 className="text-2xl font-bold text-center text-gray-800">생활 습관</h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        취미, 종교, 흡연 및 음주 여부를 입력해주세요
      </p>

      <div className="space-y-4">
        <input
          name="hobbies"
          value={formData.hobbies}
          onChange={(e) => onChange("hobbies", e.target.value)}
          placeholder="취미"
          className="w-full p-2 border rounded text-black"
        />

        <select
          name="religion"
          value={formData.religion}
          onChange={handleSelect}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">종교</option>
          <option value="none">무교</option>
          <option value="christian">기독교</option>
          <option value="catholic">천주교</option>
          <option value="buddhist">불교</option>
          <option value="etc">기타</option>
        </select>

        <select
          name="smoking"
          value={formData.smoking}
          onChange={handleSelect}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">흡연 여부</option>
          <option value="yes">흡연함</option>
          <option value="no">흡연하지 않음</option>
        </select>

        <select
          name="drinking"
          value={formData.drinking}
          onChange={handleSelect}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">음주 여부</option>
          <option value="yes">음주함</option>
          <option value="no">음주하지 않음</option>
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
