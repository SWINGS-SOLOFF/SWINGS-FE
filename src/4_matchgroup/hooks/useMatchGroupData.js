import { useState } from "react";
import { getAcceptedParticipants } from "../api/matchParticipantApi";
import { getCurrentUser, getMatchGroupById } from "../api/matchGroupApi";
import { getChatMessagesByGroupId } from "../api/matchGroupChatApi";

export const useMatchGroupData = (matchGroupId) => {
    const [participants, setParticipants] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [group, setGroup] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const fetchData = async () => {
        const user = await getCurrentUser();
        const accepted = await getAcceptedParticipants(matchGroupId);
        const groupInfo = await getMatchGroupById(matchGroupId);

        const isAccepted = accepted.some(p => p.userId === user.userId) || user.userId === groupInfo.hostId;
        setCurrentUser(user);
        setParticipants(accepted);
        setGroup(groupInfo);
        setIsAuthorized(isAccepted);

        if (isAccepted) {
            return await getChatMessagesByGroupId(matchGroupId);
        }
        return [];
    };

    return {
        participants,
        currentUser,
        group,
        isAuthorized,
        fetchData,
    };
};