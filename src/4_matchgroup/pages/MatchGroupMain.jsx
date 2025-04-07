import { Link } from "react-router-dom";
import { ClubIcon as GolfIcon, Users2Icon, CalendarIcon } from "lucide-react";
import Button from "../components/ui/GroupButton.jsx";
import GroupButton from "../components/ui/GroupButton.jsx";

export default function MatchGroupMain() {
    return (
        <div className="min-h-screen bg-white py-12 px-4">
            <div className="max-w-4xl mx-auto">

                {/* 헤더 */}
                <div className="text-center mt-14 mb-12">
                    <h1 className="text-4xl md:text-4xl font-bold text-gray-900 mb-4">
                        그룹 매치 페이지
                    </h1>
                    <p className="text-base md:text-lg text-gray-600">
                        함께 골프를 즐길 파트너를 찾아보세요. 스크린 골프부터 필드까지 다양한 매칭이 가능합니다.
                    </p>
                    <div className="mt-6">
                        <GroupButton asChild size="default">
                            <Link to="/swings/matchgroup/create" className="text-black">+ 매칭 등록하기</Link>
                        </GroupButton>
                    </div>
                </div>

                {/* 매칭 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <MatchCard
                        icon={<GolfIcon className="h-6 w-6 text-gray-700" />}
                        title="스크린 골프"
                        desc="실내 스크린 골프로 가볍게 즐기고 싶은 분들을 위한 매칭입니다."
                        to="/swings/matchgroup/screen"
                    />
                    <MatchCard
                        icon={<CalendarIcon className="h-6 w-6 text-gray-700" />}
                        title="필드 골프"
                        desc="자연 속에서 함께 라운딩할 파트너를 찾아보세요."
                        to="/swings/matchgroup/field"
                    />
                </div>

                {/* 안내 영역 */}
                <div className="mt-16 bg-gray-50 border border-gray-200 p-6 rounded-xl">
                    <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">
                        이용 안내
                    </h2>
                    <div className="grid gap-4">
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
                </div>
            </div>
        </div>
    );
}

// 카드 컴포넌트
function MatchCard({ icon, title, desc, to }) {
    return (
        <Link
            to={to}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col items-center text-center"
        >
            <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{desc}</p>
            <Button variant="outline" size="sm">매칭 보기</Button>
        </Link>
    );
}

// 안내 아이템
function InfoItem({ icon, title, desc }) {
    return (
        <div className="flex items-start gap-4">
            <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-full">
                {icon}
            </div>
            <div>
                <h3 className="font-medium text-gray-900">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
            </div>
        </div>
    );
}
