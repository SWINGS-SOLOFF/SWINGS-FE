import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {createMatchGroup} from "../api/matchGroupApi.js";

const CreateMatchGroup = () => {
    const navigate = useNavigate();  // 페이지 이동을 위한 navigate 함수
    const [groupData, setGroupData] = useState({
        name: "",  // 그룹명
        description: "",  // 그룹 설명
        maxParticipants: 10,  // 최대 참가자 수
        currentParticipants: 0, // 현재 참가자 수
        ageRange: "20-40",  // 연령대
        genderRatio: "1:1",  // 성별 비
        location: "",  // 골프장 위치
        dateTime: "",  // 경기 일정
        playStyle: "casual",  // 플레이 스타일(캐쥬얼 | 경쟁적)
        recruitmentDeadline: "",  // 모집 마감 일정
        status: "모집중",  // 모집 상태
    });

    
    // 핸들러
    // 압력값 변경
    const handleChange = (e) => {
        const { name, value } = e.target;

        setGroupData((prevState) => {
            let newStatus = prevState.status; // 기존 상태 유지

            if (name === "recruitmentDeadline") {
                const now = new Date();
                const deadline = new Date(value);
                newStatus = deadline < now ? "모집 완료" : "모집중";
            }

            return {
                ...prevState,
                [name]: value, // 입력 필드 업데이트
                status: newStatus, // 모집 상태 업데이트
            };
        });
    };

    // 그룹 생성
    const handleSubmit = async (e) => {
        e.preventDefault();  // 기본 폼 제출 방지
        try {
            await createMatchGroup(groupData);  // API를 통해 그룹 생성 요청
            alert("그룹이 생성되었습니다!");  // 성공 알림
            navigate("/matchgroup");  // 그룹 목록 페이지로 이동
        } catch (error) {
            console.error("그룹 생성 실패:", error);
            alert("그룹 생성 중 오류가 발생했습니다.");
        }
    };

    return(
        <div className="flex items-center justify-center min-h-screen bg-pink-100">
            <div className="w-full max-w-lg p-6 bg-white shadow-2xl rounded-2xl border border-pink-300">
                <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center"> 💕 그룹 생성 💕 </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <label htmlFor="name" className="block text-pink-700 font-semibold mb-2">
                        뭐 설명이나 쓰지뭐..
                    </label>
                    <input
                        type="text"
                        name="name"
                        placeholder="그룹명"
                        value={groupData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <textarea
                        name="description"
                        placeholder="설명"
                        value={groupData.description}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="number"
                        name="maxParticipants"
                        placeholder="최대 인원"
                        value={groupData.maxParticipants}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="number"
                        name="currentParticipants"
                        placeholder="현재 참가자 수"
                        value={groupData.currentParticipants}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="text"
                        name="genderRatio"
                        placeholder="남녀 성비 (예: 1:1, 2:1)"
                        value={groupData.genderRatio}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="text"
                        name="ageRange"
                        placeholder="연령대 (예: 20-30, 30-40)"
                        value={groupData.ageRange}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="text"
                        name="location"
                        placeholder="골프장 장소"
                        value={groupData.location}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="datetime-local"
                        name="dateTime"
                        placeholder="일시"
                        value={groupData.dateTime}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <input
                        type="datetime-local"
                        name="recruitmentDeadline"
                        placeholder="모집 마감 일정"
                        value={groupData.recruitmentDeadline || ""}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    />
                    <select
                        name="playStyle"
                        value={groupData.playStyle}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
                    >
                        <option value="casual">캐주얼</option>
                        <option value="competitive">경쟁적</option>
                    </select>
                    <button
                        type="submit"
                        className="w-full p-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition"
                    >
                        그룹 생성
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateMatchGroup;