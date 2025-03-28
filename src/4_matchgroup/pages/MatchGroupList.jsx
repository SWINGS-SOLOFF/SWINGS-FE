import { useEffect, useState } from "react";
import { getAllMatchGroups } from "../api/matchGroupApi.js";
import {useNavigate, useParams} from "react-router-dom";
import MatchGroupCard from "../components/MatchGroupCard.jsx";

const MatchGroupList = () => {
    const [groups, setGroups] = useState([]);  // 그룹 목록 저장
    const { category } = useParams();  // URL에서 카테고리 가져오기
    const navigate = useNavigate();  // 페이지 이동을 위한 navigate 함수



    // 그룹 목록 가져오기
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const data  = await getAllMatchGroups(category);
                console.log("응답데이터:", data);

                if (!Array.isArray(data)) {
                    console.error("API에서 받은 데이터가 배열이 아닙니다.", data);
                    setGroups([]);  // 문제가 발생하면 빈 배열로 설정
                    return;
                }

                // 선택한 카테고리만 필터링
                const filteredGroups = category
                    ? data.filter(group => group.matchType  === category)
                    : data;

                setGroups(filteredGroups);  // 정상적으로 데이터를 설정
            } catch (error) {
                console.error("그룹 목록을 불러오는 중 오류 발생:", error);
                setGroups([]);  // 오류 발생 시 빈 배열로 설정
            }
        };

        fetchGroups();  // 컴포넌트 마운트 시 데이터 요청
    }, [category]);


    // 그룹 목록을 화면에 표시하는 함수
    return (
        <div className="max-w-5xl mx-auto p-8 text-center">
            {/* 제목과 그룹 생성 버튼 영역 */}
            <h1 className="text-3xl font-bold text-green-700 mb-4">
                {category === "screen" ? "스크린 골프 매칭" : "필드 골프 매칭"}
            </h1>

            {/* 그룹이 없을 경우 메시지 표시 */}
            {groups.length === 0 ? (
                <p className="text-gray-500 text-center">현재 모집 중인 그룹이 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* 그룹 리스트 랜더링 */}
                    {groups.map((group) => (
                        <MatchGroupCard key={group.id} group={group} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MatchGroupList;
