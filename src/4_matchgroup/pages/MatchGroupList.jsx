import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllMatchGroups, getCurrentUser } from "../api/matchGroupApi";
import MatchGroupCard from "../components/MatchGroupCard";
import { motion } from "framer-motion";

const MatchGroupList = () => {
    const { category } = useParams();

    const [tab, setTab] = useState("all");
    const [groups, setGroups] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [filteredGroups, setFilteredGroups] = useState([]);

    const [region, setRegion] = useState("전체");
    const [selectedDate, setSelectedDate] = useState("");

    const regionOptions = ["전체", "서울", "경기", "부산", "대구", "대전", "광주"];

    // 1. 유저 + 전체 그룹 가져오기
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

    // 2. 탭 + 필터 반영
    useEffect(() => {
        let filtered = [...groups];

        // 탭: 내 그룹만
        if (tab === "my" && currentUser) {
            filtered = filtered.filter((g) =>
                g.participants?.some((p) => p.userId === currentUser.userId)
            );
        }

        // 지역 필터
        if (region !== "전체") {
            filtered = filtered.filter((g) => g.location?.includes(region));
        }

        // 날짜 필터
        if (selectedDate) {
            filtered = filtered.filter((g) =>
                g.schedule?.startsWith(selectedDate)
            );
        }

        setFilteredGroups(filtered);
    }, [groups, tab, region, selectedDate, currentUser]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-center mb-4">
                {category === "screen" ? "스크린 골프 그룹" : "필드 골프 그룹"}
            </h1>

            {/* 탭 버튼 */}
            <div className="bg-gray-100 p-1 rounded-xl flex w-full max-w-md mx-auto mb-6 shadow-inner">
                <button
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        tab === "all"
                            ? "bg-white text-black shadow-sm"
                            : "text-gray-500 hover:text-black"
                    }`}
                    onClick={() => setTab("all")}
                >
                    전체 그룹
                </button>
                <button
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        tab === "my"
                            ? "bg-white text-black shadow-sm"
                            : "text-gray-500 hover:text-black"
                    }`}
                    onClick={() => setTab("my")}
                >
                    나의 그룹
                </button>
            </div>



            {/* 필터 */}
            <select
                className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
            >
                {regionOptions.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </select>

            <select
                className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            >
                <option value="">일정</option>
            </select>



            {/* 그룹 목록 */}
            {filteredGroups.length === 0 ? (
                <p className="text-center text-gray-500">조건에 맞는 그룹이 없습니다.</p>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {filteredGroups.map((group) => (
                        <motion.div key={group.matchGroupId} variants={itemVariants}>
                            <MatchGroupCard group={group} isMine={tab === "my"} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
};

export default MatchGroupList;