import { useState, useEffect } from "react";
import feedApi from "../api/feedApi";

const useUser = () => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await feedApi.getCurrentUser();
        setUserId(user.userId);
      } catch (err) {
        console.error("❌ 사용자 정보를 가져오는 데 실패했습니다.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return { userId, loading };
};

export default useUser;
