import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "./ui/Card.jsx";
import { Badge } from "./ui/Badge.jsx";
import JoinConfirmModal from "./JoinConfirmModal.jsx";
import { getCurrentUser } from "../api/matchGroupApi.js";
import useMatchGroupActions from "../hooks/useMatchGroupActions";
import { getAcceptedParticipants } from "../api/matchParticipantApi";

export default function MatchGroupCard({ group }) {
    const navigate = useNavigate();
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [acceptedParticipants, setAcceptedParticipants] = useState([]);
    const { handleJoin } = useMatchGroupActions(null, currentUser);

    const [isParticipant, setIsParticipant] = useState(false);
    const [isPending, setIsPending] = useState(false);

    useEffect(() => {
        getCurrentUser().then((user) => {
            setCurrentUser(user);
        });

        getAcceptedParticipants(group.matchGroupId).then((data) => {
            setAcceptedParticipants(data);
        });
    }, [group]);

    useEffect(() => {
        if (!currentUser || acceptedParticipants.length === 0) return;

        const accepted = acceptedParticipants.some(
            (p) => p.userId === currentUser.userId
        );
        setIsParticipant(accepted);

        const pending = group?.participants?.some(
            (p) => p.userId === currentUser.userId && p.participantStatus === "PENDING"
        );
        setIsPending(pending);
    }, [currentUser, acceptedParticipants]);

    const genderCount = acceptedParticipants.reduce(
        (acc, p) => {
            if (p.gender === "female") acc.female += 1;
            else if (p.gender === "male") acc.male += 1;
            return acc;
        },
        { female: 0, male: 0 }
    );

    const isRecruitClosed = group.closed;
    const isFull = acceptedParticipants.length >= group.maxParticipants;
    const genderLimitReached =
        (currentUser?.gender === "FEMALE" && genderCount.female >= group.femaleLimit) ||
        (currentUser?.gender === "MALE" && genderCount.male >= group.maleLimit);

    const disableJoin = isRecruitClosed || isFull || genderLimitReached;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    };

    return (
        <>
            <Card className="rounded-2xl border shadow-md transition-all duration-300 hover:shadow-xl bg-white">
                <CardHeader className="pb-0">
                    <div className="flex items-center justify-between mb-1">
                        <Badge variant={group.matchType === "screen" ? "info" : "success"}>
                            {group.matchType === "screen" ? "스크린" : "필드"}
                        </Badge>
                        <Badge variant={disableJoin ? "warning" : "success"}>
                            {isRecruitClosed
                                ? "모집 종료"
                                : isFull
                                    ? "모집 완료"
                                    : "모집 중"}
                        </Badge>
                    </div>
                    <CardTitle className="text-lg font-semibold leading-tight truncate">
                        {group.groupName}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 line-clamp-2">
                        {group.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-2 pb-0">
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <MapPinIcon className="h-4 w-4 text-golf-green-600" />
                            <span className="truncate">{group.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarIcon className="h-4 w-4 text-golf-green-600" />
                            <span>{formatDate(group.schedule)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <UsersIcon className="h-4 w-4 text-golf-green-600" />
                            <span>
                                {acceptedParticipants.length}/{group.maxParticipants}명
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-golf-green-700">방장:</span>
                            <span className="truncate">{group.hostUsername}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-4">
                    {isParticipant ? (
                        <button
                            onClick={() =>
                                navigate(`/swings/matchgroup/waitingroom/${group.matchGroupId}`)
                            }
                            className="w-full bg-custom-pink text-white font-bold py-2 px-4 rounded-xl hover:bg-pink-400 transition"
                        >
                            그룹 입장
                        </button>
                    ) : isPending ? (
                        <button
                            disabled
                            className="w-full bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-xl cursor-not-allowed"
                        >
                            수락 대기 중
                        </button>
                    ) : (
                        <button
                            className={`w-full py-2 px-4 rounded-xl font-bold text-white transition ${
                                disableJoin
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-custom-purple"
                            }`}
                            onClick={() => setShowJoinModal(true)}
                            disabled={disableJoin}
                        >
                            {isRecruitClosed
                                ? "모집 종료"
                                : isFull
                                    ? "모집 완료"
                                    : genderLimitReached
                                        ? "성비 제한"
                                        : "참가 신청"}
                        </button>
                    )}
                </CardFooter>
            </Card>

            {/* 참가 신청 모달 */}
            <JoinConfirmModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                group={{ ...group, currentUserId: currentUser?.userId }}
                participants={acceptedParticipants}
                onConfirm={async () => {
                    if (genderLimitReached) {
                        alert("성비 제한으로 인해 참가할 수 없습니다.");
                        return;
                    }
                    await handleJoin(group.matchGroupId, currentUser?.userId); // ✅ navigate 제거
                }}
            />
        </>
    );
}