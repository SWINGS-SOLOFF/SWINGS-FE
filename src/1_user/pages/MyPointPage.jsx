import { useEffect, useState } from "react";
import { getPointBalance, getPointHistory } from "../api/userapi";
import { Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

  // ✅ 기존: TossCheckout으로 바로 이동
  // ✅ 수정: PointCharge 페이지로 이동
  const goToChargePage = () => {
    navigate("/swings/mypage/points/charge");
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-[#2E384D] flex justify-center items-center gap-2">
          <Coins className="text-yellow-400" />
          포인트 관리
        </h1>
        <p className="mt-2 text-green-600 text-xl font-semibold">
          보유 포인트: {balance.toLocaleString()}P
        </p>
        <button
          onClick={goToChargePage}
          className="mt-4 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg shadow-md"
        >
          💳 포인트 충전하기
        </button>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-700 mb-2">
          📋 포인트 사용 내역
        </h2>
        <ul className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-gray-400 text-sm">사용 내역이 없습니다.</p>
          ) : (
            logs.map((log, idx) => (
              <li
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-md px-4 py-3 shadow-sm"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{log.createdAt}</span>
                  <span
                    className={`font-semibold ${
                      log.amount >= 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {log.amount >= 0 ? `+${log.amount}` : log.amount}P
                  </span>
                </div>
                <div className="mt-1 text-sm text-black">
                  {log.description}{" "}
                  <span className="text-xs text-gray-400">({log.type})</span>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
