import { useMemo} from "react";

const useMatchStatus = (group, currentUser, participants, pendingParticipants) => {
    return useMemo(() => {
        const username = currentUser?.username;

        return {
            isHost: group?.creator === username,
            isFull: group?.currentParticipants >= group?.maxParticipants,
            isParticipant: participants?.some((p) => p.username === username),
            isPending: pendingParticipants?.some((p) => p.username === username),
        };
    }, [group, currentUser, participants, pendingParticipants]);
};

export default useMatchStatus;