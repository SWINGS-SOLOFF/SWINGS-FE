import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { MapPin, Plus } from "lucide-react";
import { format, getDaysInMonth, isToday } from "date-fns";
import { ko } from "date-fns/locale";

import MatchGroupCard from "../components/MatchGroupCard";
import useMatchGroupList from "../hooks/useMatchGroupList";
import MatchGroupCreate from "./MatchGroupCreate.jsx";
import BaseModal from "../components/ui/BaseModal";
import MapRegionModal from "../components/MapRegionModal";

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

const MatchGroupList = () => {
    const { category } = useParams();
    const navigate = useNavigate();

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);
    const [monthOffset, setMonthOffset] = useState(0);
    const [scrollReady, setScrollReady] = useState(false);

    const scrollRef = useRef(null);
    const today = new Date();
    const baseMonth = new Date(today.getFullYear(), today.getMonth() + monthOffset);
    const daysInMonth = getDaysInMonth(baseMonth);

    const {
        tab,
        setTab,
        setRegion,
        selectedDate,
        setSelectedDate,
        filteredGroups,
    } = useMatchGroupList(category);

    const groupCountByDate = filteredGroups.reduce((acc, g) => {
        const date = g.schedule?.split("T")[0];
        if (date) acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const handleDateClick = (ymd) => {
        if (selectedDate === ymd) {
            setSelectedDate("");
        } else {
            setSelectedDate(ymd);
        }
    };

    const changeMonth = (delta) => {
        setMonthOffset((prev) => prev + delta);
        setScrollReady(false);
    };

    useEffect(() => {
        if (!scrollRef.current) return;
        const todayEl = scrollRef.current.querySelector(".today");
        if (todayEl && !scrollReady) {
            todayEl.scrollIntoView({ inline: "center", behavior: "smooth" });
            setScrollReady(true);
        }
    }, [monthOffset, scrollReady]);

    return (
        <div className="relative max-w-6xl mx-auto px-4 py-6">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-4 mb-4">
                <button onClick={() => navigate("/swings/matchgroup")} className="text-gray-700">
                    <IoIosArrowBack size={25} />
                </button>
                <h1 className="text-xl font-bold text-center">
                    {category === "screen" ? "SCREEN" : "FIELD"}
                </h1>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="text-custom-pink font-bold"
                    title="그룹 만들기"
                >
                    <Plus size={25} />
                </button>
            </div>

            {/* 탭 */}
            <div className="bg-gray-100 p-1 rounded-xl flex w-full max-w-md mx-auto mb-4 shadow-inner">
                {["all", "my"].map((type) => (
                    <button
                        key={type}
                        className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                            tab === type ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-black"
                        }`}
                        onClick={() => setTab(type)}
                    >
                        {type === "all" ? "All" : "My"}
                    </button>
                ))}
            </div>

            {/* 버튼 영역 */}
            <div className="flex justify-between items-center mb-4 px-2">
                <button onClick={() => setShowMapModal(true)}>
                    <MapPin />
                </button>
            </div>

            {/* 날짜 필터 */}
            <div className="flex items-center gap-3 mb-3 px-2">
                <div className="flex flex-col items-center min-w-fit">
                    <button onClick={() => changeMonth(-1)} className="text-xl mb-1">
                        <IoIosArrowUp />
                    </button>
                    <span className="font-bold whitespace-nowrap text-center leading-none my-1">
                        {format(baseMonth, "M월")}
                    </span>
                    <button onClick={() => changeMonth(1)} className="text-xl mt-1">
                        <IoIosArrowDown />
                    </button>
                </div>

                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
                >
                    {Array.from({ length: daysInMonth }, (_, i) => {
                        const date = new Date(baseMonth.getFullYear(), baseMonth.getMonth(), i + 1);
                        const ymd = format(date, "yyyy-MM-dd");
                        const day = format(date, "d");
                        const weekday = format(date, "EEE", { locale: ko });
                        const isSelected = selectedDate === ymd;
                        const isCurrentDay = isToday(date);

                        return (
                            <button
                                key={ymd}
                                onClick={() => handleDateClick(ymd)}
                                className={`flex flex-col items-center justify-center w-12 text-xs font-medium rounded-lg py-1 ${
                                    isSelected ? "bg-custom-pink text-white" : "text-gray-700"
                                } ${isCurrentDay && !isSelected ? "border border-pink-400 today" : ""}`}
                            >
                                <span
                                    className={`mb-1 ${
                                        weekday === "토"
                                            ? "text-blue-500"
                                            : weekday === "일"
                                                ? "text-red-500"
                                                : ""
                                    }`}
                                >
                                    {weekday}
                                </span>
                                <span className="text-[13px] mb-1">{day}</span>
                                <span className="w-6 h-6 bg-gray-200 rounded-full text-[12px] flex items-center justify-center">
                                    {groupCountByDate[ymd] || 0}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

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

            {/* 그룹 생성 모달 */}
            {showCreateModal && (
                <BaseModal onClose={() => setShowCreateModal(false)} title="그룹 만들기" maxWidth="max-w-md">
                    <div className="max-h-[60vh] overflow-y-auto scrollbar-hide px-2">
                        <MatchGroupCreate isModal={true} onSuccess={() => setShowCreateModal(false)} />
                    </div>
                </BaseModal>
            )}

            {/* 지도 모달 */}
            {showMapModal && (
                <MapRegionModal
                    isOpen={showMapModal}
                    onClose={() => setShowMapModal(false)}
                    groups={filteredGroups}
                    setRegion={setRegion}
                />
            )}
        </div>
    );
};

export default MatchGroupList;