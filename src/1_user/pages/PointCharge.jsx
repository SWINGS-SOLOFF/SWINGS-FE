// src/1_user/pages/PointCharge.jsx
import { useEffect, useState } from "react";
import { Coins, DollarSign, Gem, PiggyBank, Wallet } from "lucide-react";
import CoinSelectModal from "../components/CoinSelectModal";
import { fetchUserData } from "../api/userapi";

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
    <div className="p-6 text-center space-y-8">
      <h1 className="text-3xl font-bold text-[#2E384D] animate-fade-in">
        포인트 충전
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

      <p className="text-gray-500 text-sm mt-4 animate-pulse">
        💰 1코인 = 1,000원
      </p>

      {isModalOpen && user?.userId && (
        <CoinSelectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          coin={selectedCoin}
          userId={user.userId}
          redirectToCheckout={true} // 🔥 추가!
        />
      )}
    </div>
  );
}
