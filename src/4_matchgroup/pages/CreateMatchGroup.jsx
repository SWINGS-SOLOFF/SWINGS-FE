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
        playStyle: "상관없음",  // 플레이 스타일(캐쥬얼 | 경쟁적)
        recruitmentDeadline: "",  // 모집 마감 일정
        status: "모집중",  // 모집 상태
    });

    
    // 핸들러
    // 압력값 변경
    const handleChange  = (e) => {
        const {name, value} = e.target;
        setGroupData({...groupData, [name]: value});

        // 모집 상태 업데이트
        if(name === "recruitmentDeadline"){
            const now = new Date();
            const deadline  = new Date(value);
            const newStatus = deadline < now ? "모집 완료" : "모집중";
            setGroupData({...groupData, status: newStatus});
        }
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
        <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-bold mb-4"> 그룹 생성 </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="그룹명"
                    value={groupData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <textarea
                    name="description"
                    placeholder="설명"
                    value={groupData.description}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="maxParticipants"
                    placeholder="최대 인원"
                    value={groupData.maxParticipants}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="number"
                    name="currentParticipants"
                    placeholder="현재 참가자 수"
                    value={groupData.currentParticipants}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="genderRatio"
                    placeholder="남녀 성비 (예: 1:1, 2:1)"
                    value={groupData.genderRatio}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="ageRange"
                    placeholder="연령대 (예: 20-30, 30-40)"
                    value={groupData.ageRange}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="text"
                    name="location"
                    placeholder="골프장 장소"
                    value={groupData.location}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="datetime-local"
                    name="dateTime"
                    placeholder="일시"
                    value={groupData.dateTime}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <input
                    type="datetime-local"
                    name="recruitmentDeadline"
                    placeholder="모집 마감 일정"
                    value={groupData.recruitmentDeadline}
                    onChange={handleChange}
                    required
                    className="w-full p-2 border rounded"
                />
                <select
                    name="playStyle"
                    value={groupData.playStyle}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                >
                    <option value="casual">캐주얼</option>
                    <option value="competitive">경쟁적</option>
                </select>
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    그룹 생성
                </button>
            </form>
        </div>
    );
};

export default CreateMatchGroup;