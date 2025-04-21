import { useEffect, useState } from "react";
import { getPointBalance, getPointHistory } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

export default function MyPointPage() {
  const [balance, setBalance] = useState(0);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const b = await getPointBalance();
      const l = await getPointHistory();
      setBalance(b);
      setLogs(l);
    } catch (err) {
      console.error("포인트 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const goToChargePage = () => {
    navigate("/swings/shop");
  };

  const formatPrettyDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "M월 d일 a h:mm", { locale: ko });
  };

  const groupedLogs = logs.reduce((acc, log) => {
    const date = new Date(log.createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const key = isToday
      ? "오늘"
      : isYesterday
      ? "어제"
      : format(date, "M월 d일", { locale: ko });

    if (!acc[key]) acc[key] = [];
    acc[key].push(log);
    return acc;
  }, {});

  const totalSpent = logs.reduce(
    (sum, log) => (log.amount < 0 ? sum + Math.abs(log.amount) : sum),
    0
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] px-5 pt-6 pb-24">
      {/* ✅ 카드형 보유 코인 UI */}
      <motion.section
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-md rounded-2xl p-5 mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">보유 중인 하트</p>
            <h1 className="text-3xl font-bold text-black">
              {balance.toLocaleString()} 하트
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              지금까지{" "}
              <span className="font-semibold text-gray-700">
                {totalSpent.toLocaleString()} 하트
              </span>{" "}
              사용했어요
            </p>
          </div>
          <button
            onClick={goToChargePage}
            className="bg-custom-coin text-white text-sm py-2 px-4 rounded-xl hover:opacity-90 active:scale-95 font-bold"
          >
            충전
          </button>
        </div>
      </motion.section>

      {/* ✅ 이벤트 배너 - 말풍선처럼 작게 */}
      <section className="bg-[#fff3cd] text-[#856404] px-4 py-2.5 rounded-xl text-xs font-medium mb-6 shadow-sm flex items-center gap-2">
        🎁 이벤트: 30하트 이상 충전 시 10% 더 드려요!
      </section>

      <hr className="my-6 border-gray-200" />

      {/* ✅ 사용 내역 */}
      <section>
        <h2 className="text-base font-bold text-gray-800 mb-4">최근 활동</h2>

        {logs.length === 0 ? (
          <p className="text-sm text-gray-400 text-center mt-10">
            아직 사용 내역이 없어요!
          </p>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedLogs).map(([label, group], i) => (
              <div key={i}>
                <p className="text-xs text-gray-500 font-medium mb-2">
                  {label}
                </p>
                <ul className="space-y-4">
                  <AnimatePresence>
                    {group.map((log, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex justify-between items-start"
                      >
                        <div>
                          <p className="text-[15px] text-gray-900 font-medium">
                            {log.description.includes("슈퍼챗")
                              ? "슈퍼챗 사용"
                              : log.description}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatPrettyDate(log.createdAt)}
                          </p>
                        </div>
                        <p
                          className={`text-[15px] font-semibold ${
                            log.amount >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {log.amount >= 0 ? `+${log.amount}` : log.amount} 하트
                        </p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
