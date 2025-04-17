import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import MatchGroupCard from "../components/MatchGroupCard";
import useMatchGroupList from "../hooks/useMatchGroupList";

const MatchGroupList = () => {
    const { category } = useParams();
    const navigate = useNavigate();

    const {
        tab,
        setTab,
        region,
        setRegion,
        selectedDate,
        setSelectedDate,
        regionOptions,
        filteredGroups,
    } = useMatchGroupList(category);

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
        <div className="relative max-w-6xl mx-auto px-4 py-6">
            {/* ← 뒤로가기 버튼 */}
            <div className="absolute top-4 left-4">
                <button
                    onClick={() => navigate("/swings/matchgroup")}
                    className="absolute top-4 left-1 text-gray-700 transition-all"
                >
                    <ArrowLeft size={25} />
                </button>
            </div>

            <h1 className="text-2xl font-bold text-center mb-4">
                {category === "screen" ? "SCREEN" : "FIELD"}
            </h1>

            {/* 탭 */}
            <div className="bg-gray-100 p-1 rounded-xl flex w-full max-w-md mx-auto mb-6 shadow-inner">
                <button
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        tab === "all"
                            ? "bg-white text-black shadow-sm"
                            : "text-gray-500 hover:text-black"
                    }`}
                    onClick={() => setTab("all")}
                >
                    All
                </button>
                <button
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                        tab === "my"
                            ? "bg-white text-black shadow-sm"
                            : "text-gray-500 hover:text-black"
                    }`}
                    onClick={() => setTab("my")}
                >
                    My
                </button>
            </div>

            {/* 필터 */}
            <select
                className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition mr-2"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
            >
                {regionOptions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                ))}
            </select>

            <select
                className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            >
                <option value="">일정</option>
                {/* 날짜 동적 생성은 이후 확장 */}
            </select>

            {/* 그룹 목록 */}
            {filteredGroups.length === 0 ? (
                <p className="text-center text-gray-500 mt-10">조건에 맞는 그룹이 없습니다.</p>
            ) : (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6"
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
