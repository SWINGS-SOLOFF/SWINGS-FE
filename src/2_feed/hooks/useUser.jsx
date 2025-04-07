import { useEffect, useState } from "react";
import feedApi from "../api/feedApi";

const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userData = await feedApi.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("❌ 사용자 정보를 가져오는 데 실패했습니다.", error);
      }
    };

    fetchUserInfo();
  }, []);

  return { user, userId: user?.userId };
};

export default useUser;
