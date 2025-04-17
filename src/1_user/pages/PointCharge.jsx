import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CoinSelectModal from "../components/CoinSelectModal";
import { fetchUserData } from "../api/userApi";

// 코인 금액 옵션
const coinOptions = [
  { coin: 5, price: 5000 },
  { coin: 10, price: 10000 },
  { coin: 33, price: 30000, label: "30 + 10%" },
  { coin: 55, price: 50000, label: "50 + 10%" },
  { coin: 110, price: 100000, label: "100 + 10%" },
  { coin: 330, price: 300000, label: "300 + 10%" },
];

// 하트 스타일 맵 (크기 + 색상)
const getHeartStyle = (coin) => {
  if (coin === 5)
    return { size: 24, textColor: "text-gray-300", fillColor: "fill-none" };
  if (coin === 10)
    return { size: 28, textColor: "text-pink-200", fillColor: "fill-pink-100" };
  if (coin === 33)
    return { size: 32, textColor: "text-pink-300", fillColor: "fill-pink-200" };
  if (coin === 55)
    return { size: 36, textColor: "text-pink-400", fillColor: "fill-pink-300" };
  if (coin === 110)
    return { size: 40, textColor: "text-pink-500", fillColor: "fill-pink-400" };
  if (coin === 330)
    return { size: 44, textColor: "text-pink-600", fillColor: "fill-pink-500" };
  return { size: 24, textColor: "text-gray-300", fillColor: "fill-none" };
};

export default function PointCharge() {
  const [user, setUser] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData()
      .then((data) => setUser(data))
      .catch((err) => console.error("유저 정보 오류:", err));
  }, []);

  const handleCoinClick = (coin) => {
    setSelectedCoin(coin);
    setIsModalOpen(true);
  };

  return (
    <div className="px-6 pt-6 pb-10 text-center space-y-8 relative">
      {/* 뒤로가기 버튼 */}
      <button
        className="absolute left-4 top-4 text-gray-500 hover:text-black transition-colors"
        onClick={() => navigate("/swings/points")}
      >
        <IoIosArrowBack size={24} />
      </button>

      <h1 className="text-2xl font-semibold text-[#2E384D] animate-fade-in">
        충전소
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4 w-full max-w-md sm:max-w-3xl mx-auto">
        {coinOptions.map(({ coin, price, label }) => {
          const isEvent = coin >= 30;
          const { size, textColor, fillColor } = getHeartStyle(coin);

          return (
            <button
              key={coin}
              onClick={() => handleCoinClick(coin)}
              className="group relative flex flex-col justify-between items-center border rounded-xl p-4 min-h-[160px] shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 hover:-translate-y-1 bg-white"
            >
              {/* 이벤트 뱃지 */}
              {isEvent && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-[2px] rounded-full font-semibold shadow">
                  EVENT
                </div>
              )}

              {/* 아이콘 */}
              <div className={`flex justify-center ${textColor}`}>
                <Heart
                  size={size}
                  className={`transition-transform duration-300 group-hover:rotate-6 ${textColor} ${fillColor}`}
                />
              </div>

              {/* 하트 라벨 */}
              <div className="text-lg font-bold text-black mt-3 text-center">
                {label ? (
                  <>
                    <span>{label.split(" + ")[0]} + </span>
                    <span className="text-red-500 font-extrabold">10%</span>
                    <br />
                    <span className="ml-1 text-gray-700">({coin}하트)</span>
                  </>
                ) : (
                  `${coin}하트`
                )}
              </div>

              {/* 가격 */}
              <div className="text-sm text-gray-600 mt-1">
                ₩{price.toLocaleString()}
              </div>
            </button>
          );
        })}
      </div>

      {/* 결제 모달 */}
      {isModalOpen && user?.userId && (
        <CoinSelectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          coin={selectedCoin}
          userId={user.userId}
          redirectToCheckout={true}
        />
      )}
    </div>
  );
}
