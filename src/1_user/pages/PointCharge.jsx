import { useEffect, useState } from "react";
import {
  Coins,
  DollarSign,
  Gem,
  PiggyBank,
  Wallet,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import CoinSelectModal from "../components/CoinSelectModal";
import { fetchUserData } from "../api/userApi";

const coinOptions = [
  { coin: 5, price: 5000, icon: PiggyBank },
  { coin: 10, price: 10000, icon: Coins },
  { coin: 30, price: 30000, icon: DollarSign },
  { coin: 50, price: 50000, icon: Wallet },
  { coin: 100, price: 100000, icon: Gem },
  { coin: 300, price: 300000, icon: Gem },
];

export default function PointCharge() {
  const [user, setUser] = useState(null);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // ✅ 뒤로가기용

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
      {/* ✅ 뒤로가기 버튼 */}
      <button
        className="absolute left-4 top-4 text-gray-500 hover:text-black transition-colors"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={24} />
      </button>

      <h1 className="text-2xl font-semibold text-[#2E384D] animate-fade-in">
        충전소
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 max-w-lg mx-auto">
        {coinOptions.map(({ coin, price, icon: Icon }) => (
          <button
            key={coin}
            onClick={() => handleCoinClick(coin)}
            className="group border rounded-xl p-6 shadow-md hover:shadow-xl transition-transform duration-300 transform hover:scale-105 hover:-translate-y-1"
          >
            <div className="flex justify-center text-yellow-500 mb-3">
              <Icon
                size={36}
                className="transition-transform duration-300 group-hover:rotate-6"
              />
            </div>
            <div className="text-lg font-bold text-black">{coin}코인</div>
            <div className="text-sm text-gray-600">
              ₩{price.toLocaleString()}
            </div>
          </button>
        ))}
      </div>

      <p className="text-gray-500 text-sm animate-pulse">💰 1코인 = 1,000원</p>

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
