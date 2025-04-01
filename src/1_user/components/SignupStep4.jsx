import { motion } from "framer-motion";

export default function SignupStep4({ formData, onChange, onSubmit }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 space-y-6"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        마지막 단계
      </h2>
      <p className="text-center text-sm text-gray-500 mb-6">
        골프 실력과 자기소개를 입력해주세요
      </p>

      <div className="space-y-4">
        <select
          name="golfSkill"
          value={formData.golfSkill}
          onChange={(e) => onChange("golfSkill", e.target.value)}
          className="w-full p-2 border rounded text-black"
        >
          <option value="">골프 실력</option>
          <option value="beginner">초급</option>
          <option value="intermediate">중급</option>
          <option value="advanced">고급</option>
        </select>

        <textarea
          name="introduce"
          value={formData.introduce}
          onChange={(e) => onChange("introduce", e.target.value)}
          placeholder="자기소개"
          className="w-full p-2 border rounded text-black"
          rows="4"
        />
      </div>

      <button
        onClick={onSubmit}
        className="w-full bg-purple-600 text-white py-2 rounded mt-6"
      >
        회원가입 완료
      </button>
    </motion.div>
  );
}
