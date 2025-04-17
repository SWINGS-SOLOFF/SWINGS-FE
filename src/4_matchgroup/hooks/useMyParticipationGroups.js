import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/matchGroupApi";
import axiosInstance from "../../1_user/api/axiosInstance";

const useMyParticipationGroups = (isOpen, tab) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        if (!isOpen) return;

        const fetchGroups = async () => {
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);

                if (!user || !user.userId) {
                    console.warn("❗ 사용자 정보가 유효하지 않습니다.");
                    return;
                }

                let response;
                if (tab === "JOINED") {
                    response = await axiosInstance.post("/matchParticipant/my", {
                        userId: user.userId,
                        participantStatus: "ACCEPTED",
                    });
                } else if (tab === "APPLIED") {
                    response = await axiosInstance.post("/matchParticipant/my", {
                        userId: user.userId,
                        participantStatus: "PENDING",
                    });
                } else if (tab === "HOSTED") {
                    response = await axiosInstance.get(`/matchgroup/host/${user.userId}`);
                }

                setGroups(response.data);
            } catch (error) {
                console.error("⚠️ 참가 그룹 조회 실패:", error);
            }
        };

        fetchGroups();
    }, [isOpen, tab]);

    return { currentUser, groups, setGroups };
};

export default useMyParticipationGroups;