import {useNavigate} from "react-router-dom";
import Button from "../../components/Button.jsx";

const MatchGroupCard = ({ group }) => {
    const navigate = useNavigate();
    const isFull = group.currentParticipants >= group.maxParticipants;

    return (
        <div className="p-6 bg-white shadow-xl rounded-2xl cursor-pointer transition hover:shadow-2xl border border-gray-200">
            <h3 className="text-xl font-bold text-green-700">{group.name}</h3>
            <p className="text-gray-600 mb-2">{group.description}</p>
            <p className="text-sm text-gray-500">📍 장소: {group.location}</p>
            <p className="text-sm text-gray-500">⏰ 일정: {new Date(group.dateTime).toLocaleDateString()}</p>
            <p className="text-sm text-gray-500">👥 모집 현황: {group.currentParticipants}/{group.maxParticipants}명</p>
            <Button onClick={() => navigate(`/matchgroup/${group.id}`)} disabled={isFull} className="mt-4 w-full">
                {isFull ? "모집 완료" : "참여 신청하기"}
            </Button>
        </div>
    );
};

export default MatchGroupCard;




