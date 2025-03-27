import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import MyPageForm from "../components/MyPageForm";
import PasswordChangeForm from "../components/PasswordChangeForm";
import { fetchUserData, updateUserInfo } from "../api/userApi";
import { getUpdatedFields } from "../utils/userUtils";

export default function MyPage() {
  const { token } = useAuth();
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserData();
        setUserData(data);
        setFormData(data);
      } catch (err) {
        setError("사용자 정보를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (token) loadUser();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedFields = getUpdatedFields(userData, formData);
    if (Object.keys(updatedFields).length === 0) {
      alert("변경된 내용이 없습니다.");
      return;
    }

    try {
      await updateUserInfo(userData.username, updatedFields);
      setUserData({ ...userData, ...updatedFields });
      alert("회원 정보가 성공적으로 수정되었습니다!");
      setShowEditForm(false);
    } catch (err) {
      setError("회원 정보 수정 실패");
    }
  };

  const toggleEditForm = () => {
    setShowEditForm(!showEditForm);
    setShowPasswordForm(false);
  };

  const togglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    setShowEditForm(false);
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-center">마이페이지</h2>
      <div className="space-y-4">
        <button
          onClick={toggleEditForm}
          className="bg-green-500 text-white p-2 rounded w-full"
        >
          회원정보 수정
        </button>
        <button
          onClick={togglePasswordForm}
          className="bg-blue-600 text-white p-2 rounded w-full"
        >
          비밀번호 변경
        </button>

        {showEditForm && (
          <MyPageForm
            formData={formData}
            handleChange={handleChange}
            handleUpdate={handleUpdate}
          />
        )}
        {showPasswordForm && (
          <PasswordChangeForm username={userData.username} />
        )}
      </div>
    </div>
  );
}
