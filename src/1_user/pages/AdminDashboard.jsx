// AdminDashboard.jsx
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-12">
      <div className="grid gap-6 md:grid-cols-2">
        <hr />

        <button
          onClick={() => navigate("/swings/admin/users")}
          className="p-6 rounded-lg shadow bg-white hover:bg-gray-50"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            유저 관리
          </h2>
          <p className="text-gray-600 text-sm">
            가입된 유저 목록을 조회하고, 수정 및 탈퇴 처리할 수 있습니다.
          </p>
        </button>

        {/* 나중에 기능 추가 가능 */}
        {/* <button className="...">통계 보기</button> */}
      </div>
    </div>
  );
}
