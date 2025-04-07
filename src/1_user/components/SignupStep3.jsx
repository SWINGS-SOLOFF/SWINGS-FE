import Select from "react-select";
import {
  customSelectStyles,
  regionOptions,
  mbtiOptions,
} from "../utils/userUtils";

export default function SignupStep3({ formData, updateData }) {
  return (
    <div className="w-full px-4">
      <div className="w-full max-w-sm mx-auto space-y-5">
        {/* MBTI */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            MBTI
          </label>
          <Select
            options={mbtiOptions}
            value={mbtiOptions.find((opt) => opt.value === formData.mbti)}
            onChange={(selected) => updateData({ mbti: selected.value })}
            placeholder="MBTI 선택"
            styles={customSelectStyles}
          />
        </div>

        {/* 직업 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            직업
          </label>
          <input
            type="text"
            value={formData.job || ""}
            onChange={(e) => updateData({ job: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-black"
            placeholder="직업"
          />
        </div>

        {/* 활동 지역 */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            활동 지역
          </label>
          <Select
            options={regionOptions}
            value={regionOptions.find(
              (opt) => opt.value === formData.activityRegion
            )}
            onChange={(selected) =>
              updateData({ activityRegion: selected.value })
            }
            placeholder="활동 지역 선택"
            styles={customSelectStyles}
          />
        </div>
      </div>
    </div>
  );
}
