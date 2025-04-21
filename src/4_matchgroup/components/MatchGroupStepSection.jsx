import ParticipantCounters from "../components/ParticipantCounter";

export default function MatchGroupStepSection({
                                                  step,
                                                  groupData,
                                                  handleChange,
                                                  updateFemale,
                                                  updateMale,
                                                  selectedDate,
                                                  setSelectedDate,
                                                  selectedTime,
                                                  setSelectedTime,
                                                  handleAddressSearch,
                                                  setGroupData,
                                              }) {
    // STEP 1: 기본 정보
    if (step === 1) {
        return (
            <section className="bg-gray-50 rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">📦 기본 정보</h3>
                <input
                    name="groupName"
                    placeholder="그룹명"
                    value={groupData.groupName}
                    onChange={handleChange}
                    className="w-full mb-2 px-4 py-3 text-sm border rounded-lg"
                />
                <textarea
                    name="description"
                    placeholder="그룹 설명"
                    value={groupData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm border rounded-lg"
                />
            </section>
        );
    }

    // STEP 2: 모집 조건
    if (step === 2) {
        return (
            <section className="bg-gray-50 rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">👥 모집 조건</h3>

                <ParticipantCounters
                    max={groupData.maxParticipants}
                    female={groupData.femaleLimit}
                    male={groupData.maleLimit}
                    onMaxChange={(val) =>
                        setGroupData((prev) => ({ ...prev, maxParticipants: val }))
                    }
                    onFemaleChange={updateFemale}
                    onMaleChange={updateMale}
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <select
                        name="ageRange"
                        value={groupData.ageRange}
                        onChange={handleChange}
                        className="p-2 text-sm border rounded-md"
                    >
                        <option value="20대">20대</option>
                        <option value="30대">30대</option>
                        <option value="40대">40대</option>
                        <option value="상관없음">상관없음</option>
                    </select>
                    <select
                        name="playStyle"
                        value={groupData.playStyle}
                        onChange={handleChange}
                        className="p-2 text-sm border rounded-md"
                    >
                        <option value="casual">캐주얼</option>
                        <option value="competitive">경쟁적</option>
                    </select>
                    <select
                        name="skillLevel"
                        value={groupData.skillLevel}
                        onChange={handleChange}
                        className="p-2 text-sm border rounded-md"
                    >
                        <option value="초급">초급</option>
                        <option value="중급">중급</option>
                        <option value="고급">고급</option>
                        <option value="상관없음">상관없음</option>
                    </select>
                    <select
                        name="matchType"
                        value={groupData.matchType}
                        onChange={handleChange}
                        className="p-2 text-sm border rounded-md"
                    >
                        <option value="screen">스크린</option>
                        <option value="field">필드</option>
                    </select>
                </div>
            </section>
        );
    }

    // STEP 3: 일정 및 주소
    if (step === 3) {
        return (
            <section className="bg-gray-50 rounded-xl p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">📍 일정 및 장소</h3>

                <input
                    type="date"
                    value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full mb-4 px-3 py-2 text-sm border rounded-lg"
                />

                <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full mb-4 px-3 py-2 text-sm border rounded-lg"
                />

                <div className="flex gap-1 items-center">
                    <input
                        type="text"
                        name="location"
                        value={groupData.location}
                        placeholder="골프장 주소"
                        readOnly
                        className="w-full px-3 py-2 text-sm border rounded-lg bg-gray-100"
                    />
                    <button
                        type="button"
                        onClick={handleAddressSearch}
                        className="px-3 py-2 text-sm bg-custom-purple text-white font-semibold rounded-lg whitespace-nowrap"
                    >
                        검색
                    </button>
                </div>

                {groupData.location && (
                    <div id="map" className="w-full h-52 rounded-lg border mt-3" />
                )}
            </section>
        );
    }

    return null;
}