import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ClubIcon as GolfIcon,
    Users2Icon,
    CalendarIcon,
    ArrowRightIcon,
    LandPlotIcon,
} from "lucide-react";
import GroupMainBanner from "../components/ui/GroupMainBanner.jsx";
import BaseModal from "../components/ui/BaseModal.jsx";

export default function MatchGroupMain() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-full max-w-5xl mx-auto pb-32 relative">
            {/* 배너 삽입 */}
            <GroupMainBanner />

            {/* 매칭 카드 */}
            <div className="grid grid-cols-1 gap-4 px-4 mt-12">
                <MatchCard
                    icon={<GolfIcon className="h-6 w-6 text-green-600" />}
                    title="FIELD"
                    desc="자연 속에서 함께 라운딩할 파트너를 찾아보세요."
                    to="/swings/matchgroup/field"
                />
                <MatchCard
                    icon={<LandPlotIcon className="h-6 w-6 text-blue-600" />}
                    title="SCREEN"
                    desc="실내 스크린 골프로 가볍게 즐기고 싶은 분들을 위한 매칭입니다."
                    to="/swings/matchgroup/screen"
                />
            </div>

            {/* 이용 안내 */}
            <div className="text-center mt-6">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="text-sm text-gray-500 underline hover:text-gray-700"
                >
                    이용 안내 보기
                </button>
            </div>

            {/* 안내 모달 */}
            {isModalOpen && (
                <BaseModal onClose={() => setIsModalOpen(false)} title="이용 안내">
                    <div className="grid gap-6 md:grid-cols-3">
                        <InfoItem
                            icon={<Users2Icon className="h-5 w-5 text-gray-700" />}
                            title="매칭 신청 및 참여"
                            desc="원하는 그룹을 선택하고 신청해보세요. 방장이 승인하면 참여가 가능합니다."
                        />
                        <InfoItem
                            icon={<GolfIcon className="h-5 w-5 text-gray-700" />}
                            title="매칭 등록하기"
                            desc="직접 그룹을 생성하고 나만의 골프 멤버를 모집할 수 있습니다."
                        />
                        <InfoItem
                            icon={<CalendarIcon className="h-5 w-5 text-gray-700" />}
                            title="일정 관리"
                            desc="참여한 그룹의 일정을 한눈에 확인하고 관리할 수 있어요."
                        />
                    </div>
                </BaseModal>
            )}
        </div>
    );
}

// 하위 UI 컴포넌트
function MatchCard({ icon, title, desc, to }) {
    return (
        <Link
            to={to}
            className="flex items-center gap-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-5"
        >
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                {icon}
            </div>
            <div className="flex-1">
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{desc}</p>
            </div>
            <ArrowRightIcon className="h-5 w-5 text-gray-400" />
        </Link>
    );
}

function InfoItem({ icon, title, desc }) {
    return (
        <div className="flex items-start gap-4">
            <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                {icon}
            </div>
            <div>
                <h3 className="font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
            </div>
        </div>
    );
}