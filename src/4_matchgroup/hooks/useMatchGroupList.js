import { useEffect, useState } from "react";
import { getAllMatchGroups, getCurrentUser } from "../api/matchGroupApi";

export default function useMatchGroupList(category) {
    const [tab, setTab] = useState("all");
    const [groups, setGroups] = useState([]);
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [region, setRegion] = useState("전체");
    const [selectedDate, setSelectedDate] = useState("");

    const regionOptions = [
        "전체", "서울", "경기", "인천", "부산", "대구", "광주", "대전",
        "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
    ];

    // 시/도 추출 함수
    const extractRegion = (address = "") => {
        if (typeof address !== "string" || address.trim() === "") return "";
        return address.trim().split(" ")[0];
    };

    // 그룹 + 유저 데이터 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);

                const data = await getAllMatchGroups(category);
                const validGroups = category
                    ? data.filter((g) => g.matchType === category)
                    : data;

                setGroups(validGroups);
            } catch (error) {
                console.error("데이터 로딩 오류:", error);
                setGroups([]);
            }
        };

        fetchData();
    }, [category]);

    // 필터 반영
    useEffect(() => {
        let filtered = [...groups];

        if (tab === "my" && currentUser) {
            filtered = filtered.filter((g) =>
                g.participants?.some((p) => p.userId === currentUser.userId)
            );
        }

        if (region !== "전체") {
            filtered = filtered.filter((g) => extractRegion(g.location) === region);
        }

        if (selectedDate) {
            filtered = filtered.filter((g) =>
                g.schedule?.startsWith(selectedDate)
            );
        }

        setFilteredGroups(filtered);
    }, [groups, tab, region, selectedDate, currentUser]);

    return {
        tab,
        setTab,
        region,
        setRegion,
        selectedDate,
        setSelectedDate,
        regionOptions,
        filteredGroups,
        currentUser,
    };
}