import { useEffect, useState } from "react";
import { getAllMatchGroups } from "../api/matchGroupApi.js";
import { useNavigate } from "react-router-dom";
import MatchGroupCard from "../components/MatchGroupCard.jsx";
import GroupButton from "../../components/Button.jsx";

const MatchGroupList = () => {
    const [groups, setGroups] = useState([]);  // 그룹 목록 저장
    const navigate = useNavigate();  // 페이지 이동을 위한 navigate 함수

    
    // 그룹 목록 가져오기
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data  = await getAllMatchGroups();
                console.log("응답데이터:", data);
                if (!Array.isArray(data)) {
                    console.error("API에서 받은 데이터가 배열이 아닙니다.", data);
                    setGroups([]);  // 문제가 발생하면 빈 배열로 설정
                    return;
                }
                setGroups(data);  // 정상적으로 데이터를 설정
            } catch (error) {
                console.error("그룹 목록을 불러오는 중 오류 발생:", error);
                setGroups([]);  // 오류 발생 시 빈 배열로 설정
            }
        };
        fetchGroups();  // 컴포넌트 마운트 시 데이터 요청
    }, []);

    // 그룹 목록을 화면에 표시하는 함수
    return (
        <div className="max-w-5xl mx-auto p-8 text-center bg-gray-50 min-h-screen">
            {/* 제목과 그룹 생성 버튼 영역 */}
            <h1 className="text-5xl font-bold text-green-700 mb-4">골프 파트너 매칭</h1>
            <p className="text-gray-600 mb-6">함께 골프를 즐길 파트너를 찾아보세요.</p>
            <div className="flex justify-center space-x-4 mb-8">
                <GroupButton onClick={() => navigate("/swings/matchgroup/create")} className="bg-green-600 hover:bg-green-700">
                    그룹 만들기
                </GroupButton>
            </div>

            {/* 그룹이 없을 경우 메시지 표시 */}
            {groups.length === 0 ? (
                <p className="text-gray-500 text-center">현재 모집 중인 그룹이 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* 그룹 리스트 랜더링 */}
                    {groups?.map((group) => (
                        <MatchGroupCard key={group.id} group={group} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchGroupList;
