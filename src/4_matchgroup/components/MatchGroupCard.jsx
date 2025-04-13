import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import GroupButton from "./ui/GroupButton.jsx";
import { getCurrentUser } from "../api/matchGroupApi.js";
import { getParticipantsByGroupId } from "../api/matchParticipantApi.js";
import useMatchGroupActions from "../hooks/useMatchGroupActions";

export default function MatchGroupCard({ group }) {
    const navigate = useNavigate();
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [participants, setParticipants] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    const isFull = group.currentParticipants >= group.maxParticipants;

    const { handleJoin } = useMatchGroupActions(null, currentUser);

    useEffect(() => {
        if (showJoinModal && group?.matchGroupId) {
            getParticipantsByGroupId(group.matchGroupId).then((data) => {
                const approved = data.filter((p) => p.participantStatus === "ACCEPTED");
                setParticipants(approved);
            });

            getCurrentUser().then(setCurrentUser);
        }
    }, [showJoinModal, group?.matchGroupId]);

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
                        <Badge variant={isFull ? "warning" : "success"}>
                            {isFull ? "모집 완료" : "모집 중"}
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
                {group.currentParticipants}/{group.maxParticipants}명
              </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-golf-green-700">방장:</span>
                            <span className="truncate">{group.hostUsername}</span>
                        </div>
                    </div>
                </CardContent>

                <CardFooter className="pt-4 flex gap-2">
                    {/* 그룹 상세 보기 버튼 */}
                    <Link
                        to={`/swings/matchgroup/${group.matchType}/${group.matchGroupId}`}
                        className="w-1/2"
                    >
                        <button className="w-full py-2 border rounded-xl text-sm hover:bg-gray-100">
                            그룹 상세 보기
                        </button>
                    </Link>

                    {/* 게임 대기방 입장 버튼 */}
                    <Link
                        to={`/swings/matchgroup/waitingroom/${group.matchGroupId}`}
                        className="w-1/2"
                    >
                        <button className="w-full py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700">
                            대기방 입장
                        </button>
                    </Link>
                </CardFooter>
            </Card>

            <JoinConfirmModal
                isOpen={showJoinModal}
                onClose={() => setShowJoinModal(false)}
                group={group}
                participants={participants}
                onConfirm={async () => {
                    try {
                        await handleJoin(group.matchGroupId, currentUser?.userId);
                        alert("참가 신청 완료!");
                        navigate(`/swings/matchgroup/`);
                    } catch (error) {
                        console.error("신청 중 오류:", error);
                        alert("신청에 실패했습니다.");
                    }
                }}
            />
        </>
    );
}