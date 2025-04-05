import { Link } from "react-router-dom";
import {
  FaPlusCircle,
  FaGolfBall,
  FaMapMarkedAlt,
  FaCoins,
} from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 text-center">
      <p className="text-gray-500 mt-2">원하는 기능을 선택하세요.</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
        {/* 매칭 등록 */}
        <Link
          to="/swings/matchgroup/create"
          className="flex flex-col items-center p-4 bg-blue-100 rounded-xl shadow hover:bg-blue-200 transition duration-300"
        >
          <FaPlusCircle className="text-3xl text-blue-600 mb-2" />
          <span className="text-gray-800 font-semibold">매칭 등록하기</span>
        </Link>

        {/* 스크린 골프 매칭 */}
        <Link
          to="/swings/matchgroup/screen"
          className="flex flex-col items-center p-4 bg-green-100 rounded-xl shadow hover:bg-green-200 transition duration-300"
        >
          <FaGolfBall className="text-3xl text-green-600 mb-2" />
          <span className="text-gray-800 font-semibold">스크린 골프 보기</span>
        </Link>

        {/* 필드 골프 매칭 */}
        <Link
          to="/swings/matchgroup/field"
          className="flex flex-col items-center p-4 bg-yellow-100 rounded-xl shadow hover:bg-yellow-200 transition duration-300"
        >
          <FaMapMarkedAlt className="text-3xl text-yellow-600 mb-2" />
          <span className="text-gray-800 font-semibold">필드 골프 보기</span>
        </Link>

        {/* 포인트 충전 */}
        <Link
          to="/swings/mypage/points"
          className="flex flex-col items-center p-4 bg-purple-100 rounded-xl shadow hover:bg-purple-200 transition duration-300"
        >
          <FaCoins className="text-3xl text-purple-600 mb-2" />
          <span className="text-gray-800 font-semibold">포인트 충전</span>
        </Link>
      </div>
    </div>
  );
}
