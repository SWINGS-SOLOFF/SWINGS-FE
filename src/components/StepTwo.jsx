const StepTwo = ({ formData, setFormData, prevStep, submitForm }) => {
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-center">회원가입 - Step 2</h2>

      <label className="block">
        직업:
        <input
          type="text"
          placeholder="현재 직업을 입력하세요"
          className="w-full border p-2 rounded text-black"
          value={formData.job}
          onChange={(e) => setFormData({ ...formData, job: e.target.value })}
        />
      </label>

      <label className="block">
        골프 실력:
        <select
          className="w-full border p-2 rounded text-black"
          value={formData.golfSkill}
          onChange={(e) =>
            setFormData({ ...formData, golfSkill: e.target.value })
          }
        >
          <option value="">골프 실력을 선택하세요</option>
          <option value="beginner">초급</option>
          <option value="intermediate">중급</option>
          <option value="advanced">고급</option>
        </select>
      </label>

      <label className="block">
        MBTI:
        <input
          type="text"
          placeholder="MBTI를 입력하세요 (예: INFP)"
          className="w-full border p-2 rounded text-black"
          value={formData.mbti}
          onChange={(e) => setFormData({ ...formData, mbti: e.target.value })}
        />
      </label>

      <label className="block">
        취미:
        <input
          type="text"
          placeholder="취미를 입력하세요 (예: 독서, 등산)"
          className="w-full border p-2 rounded text-black"
          value={formData.hobbies}
          onChange={(e) =>
            setFormData({ ...formData, hobbies: e.target.value })
          }
        />
      </label>

      <button
        onClick={prevStep}
        className="w-full bg-gray-500 text-white p-2 rounded"
      >
        이전 단계
      </button>

      <button
        onClick={submitForm}
        className="w-full bg-green-500 text-white p-2 rounded mt-2"
      >
        회원가입 완료
      </button>
    </div>
  );
};

export default StepTwo;
