import { useState } from "react";
import { format } from "date-fns";
import { createMatchGroup } from "../api/matchGroupApi";

export default function useGroupCreate(onSuccess, step) {
    const [groupData, setGroupData] = useState({
        groupName: "",
        description: "",
        maxParticipants: 4,
        currentParticipants: 1,
        ageRange: "선호 연령대",
        femaleLimit: 2,
        maleLimit: 2,
        location: "",
        latitude: null,
        longitude: null,
        schedule: "",
        playStyle: "casual",
        recruitmentDeadline: "",
        skillLevel: "초급",
        status: "모집중",
        matchType: "screen",
    });

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const updateFemale = (val) => {
        if (val + groupData.maleLimit <= groupData.maxParticipants) {
            setGroupData((prev) => ({ ...prev, femaleLimit: val }));
        }
    };

    const updateMale = (val) => {
        if (val + groupData.femaleLimit <= groupData.maxParticipants) {
            setGroupData((prev) => ({ ...prev, maleLimit: val }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGroupData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isManualSubmit = e.nativeEvent?.submitter?.name === "submit-final";
        if (step !== 3 || !isManualSubmit) return;

        const totalGender = groupData.femaleLimit + groupData.maleLimit;
        if (totalGender !== groupData.maxParticipants)
            return setError("남녀 인원이 최대 인원과 일치해야 합니다.");
        if (!groupData.groupName.trim()) return setError("방 제목을 입력하세요.");
        if (!groupData.description.trim()) return setError("방 설명을 입력하세요.");
        if (!selectedDate || !selectedTime)
            return setError("일정과 시간을 모두 선택하세요.");
        if (!groupData.latitude || !groupData.longitude)
            return setError("주소 검색을 완료해주세요.");

        const schedule = `${format(selectedDate, "yyyy-MM-dd")}T${selectedTime}:00`;

        try {
            setLoading(true);
            await createMatchGroup({ ...groupData, schedule });
            setShowSuccess(true);
            setTimeout(() => onSuccess?.(), 2500);
        } catch (err) {
            console.error("그룹 생성 실패:", err);
            setError("그룹 생성 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return {
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
    };
}