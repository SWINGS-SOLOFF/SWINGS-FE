import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

import useGroupCreate from "../hooks/useGroupCreate";
import { useKakaoMap } from "../hooks/useKakaoMap";
import ParticipantCounters from "../components/ParticipantCounter.jsx";
import CalendarPicker from "../components/ui/CalendarPicker.jsx";

const MatchGroupCreate = ({ isModal = false, onSuccess }) => {
    const [step, setStep] = useState(1);
    const [showCalendar, setShowCalendar] = useState(false);

    const {
        groupData,
        setGroupData,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        loading,
        error,
        showSuccess,
        updateFemale,
        updateMale,
        handleChange,
        handleSubmit,
    } = useGroupCreate(onSuccess);

    const { handleAddressSearch } = useKakaoMap(groupData, setGroupData);

    const handleNext = () => setStep((prev) => Math.min(prev + 1, 3));
    const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

    return (
        <div className="relative max-h-[80vh] flex flex-col overflow-hidden">
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-10"
                    >
                        <Confetti numberOfPieces={250} recycle={false} />
                        <h2 className="text-xl font-bold text-green-600 mt-6 mb-2">
                            🎉 그룹이 성공적으로 만들어졌습니다!
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {!showSuccess && (
                <>
                    <form
                        id="createGroupForm"
                        onSubmit={handleSubmit}
                        className="flex-1 overflow-y-auto space-y-6 px-2 pb-20"
                    >
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        {/* STEP 1: 기본 정보 */}
                        {step === 1 && (
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
                        )}

                        {/* STEP 2: 일정 및 장소 */}
                        {step === 2 && (
                            <section className="bg-gray-50 rounded-xl p-4 shadow-sm">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">📍 일정 및 장소</h3>

                                {/* 달력 */}
                                <div className="mb-3">
                                    {showCalendar ? (
                                        <CalendarPicker
                                            selectedDate={selectedDate}
                                            onConfirm={(date) => {
                                                setSelectedDate(date);
                                                setShowCalendar(false);
                                            }}
                                        />
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setShowCalendar(true)}
                                            className="w-full px-3 py-2 text-sm border rounded-lg text-left bg-white"
                                        >
                                            {selectedDate ? selectedDate.toLocaleDateString() : "날짜 선택"}
                                        </button>
                                    )}
                                </div>


                                {/* 시간 */}
                                <input
                                    type="time"
                                    value={selectedTime}
                                    onChange={(e) => setSelectedTime(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border rounded-lg"
                                />

                                {/* 주소 */}
                                <div className="flex gap-1 items-center mt-3">
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
                        )}

                        {/* STEP 3: 모집 조건 */}
                        {step === 3 && (
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
                        )}
                    </form>

                    {/* 하단 네비게이션 버튼 */}
                    <div className="absolute bottom-0 left-0 w-full px-4 py-3 bg-white border-t z-20 flex justify-between">
                        {step > 1 ? (
                            <button
                                onClick={handleBack}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-black"
                            >
                                ← 이전
                            </button>
                        ) : <span />}

                        {step < 3 ? (
                            <button
                                onClick={handleNext}
                                className="px-4 py-2 text-sm bg-custom-pink text-white font-bold rounded-xl"
                            >
                                다음 →
                            </button>
                        ) : (
                            <button
                                type="submit"
                                form="createGroupForm"
                                disabled={loading}
                                className="px-6 py-2 bg-custom-pink text-white font-bold rounded-xl hover:bg-pink-500 transition"
                            >
                                {loading ? "생성 중..." : "그룹 만들기"}
                            </button>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default MatchGroupCreate;