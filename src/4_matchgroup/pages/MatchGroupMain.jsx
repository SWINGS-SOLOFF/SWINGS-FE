import { Link } from "react-router-dom"
import { ClubIcon as GolfIcon, Users2Icon, CalendarIcon } from "lucide-react"
import Button from "../components/ui/Button.jsx";

export default function MatchGroupMain() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-golf-green-50">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-golf-green-600 to-golf-green-400">
              그룹 매치 페이지
            </span>
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                        함께 골프를 즐길 파트너를 찾아보세요. 스크린 골프부터 필드까지 다양한 매칭이 가능합니다.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <Button asChild size="lg">
                            <Link to="/swings/matchgroup/create">매칭 등록하기</Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    <Link
                        to="/swings/matchgroup/screen"
                        className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="absolute inset-0 bg-golf-sky-500/10 transition-all duration-300 group-hover:bg-golf-sky-500/20"></div>
                        <div className="relative p-8 flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-golf-sky-100 flex items-center justify-center mb-6">
                                <GolfIcon className="h-8 w-8 text-golf-sky-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-golf-sky-700">스크린 골프 파트너 찾기</h3>
                            <p className="text-muted-foreground mb-6">
                                실내에서 즐기는 스크린 골프로 함께할 파트너를 찾아보세요. 초보자부터 숙련자까지 모두 환영합니다.
                            </p>
                            <Button
                                variant="outline"
                                className="group-hover:bg-golf-sky-500 group-hover:text-white transition-all duration-300"
                            >
                                스크린 골프 매칭 보기
                            </Button>
                        </div>
                    </Link>

                    <Link
                        to="/swings/matchgroup/field"
                        className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                    >
                        <div className="absolute inset-0 bg-golf-green-500/10 transition-all duration-300 group-hover:bg-golf-green-500/20"></div>
                        <div className="relative p-8 flex flex-col items-center text-center">
                            <div className="h-16 w-16 rounded-full bg-golf-green-100 flex items-center justify-center mb-6">
                                <CalendarIcon className="h-8 w-8 text-golf-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-golf-green-700">필드 골프 파트너 찾기</h3>
                            <p className="text-muted-foreground mb-6">
                                자연 속에서 즐기는 필드 골프로 함께할 파트너를 찾아보세요. 다양한 골프장에서 새로운 경험을 만들어보세요.
                            </p>
                            <Button
                                variant="outline"
                                className="group-hover:bg-golf-green-500 group-hover:text-white transition-all duration-300"
                            >
                                필드 골프 매칭 보기
                            </Button>
                        </div>
                    </Link>
                </div>

                <div className="mt-16 max-w-3xl mx-auto rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-6">골프 매칭 서비스 이용 안내</h2>
                    <div className="grid gap-6">
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-golf-green-100 flex items-center justify-center shrink-0">
                                <Users2Icon className="h-5 w-5 text-golf-green-600" />
                            </div>
                            <div>
                                <h3 className="font-medium mb-1">매칭 신청 및 참여</h3>
                                <p className="text-muted-foreground text-sm">
                                    원하는 매칭 그룹을 찾아 신청하고, 방장의 승인 후 참여할 수 있습니다.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-golf-green-100 flex items-center justify-center shrink-0">
                                <GolfIcon className="h-5 w-5 text-golf-green-600" />
                            </div>
                            <div>
                                <h3 className="font-medium mb-1">매칭 등록하기</h3>
                                <p className="text-muted-foreground text-sm">직접 매칭 그룹을 만들고 참가자를 모집할 수 있습니다.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="h-10 w-10 rounded-full bg-golf-green-100 flex items-center justify-center shrink-0">
                                <CalendarIcon className="h-5 w-5 text-golf-green-600" />
                            </div>
                            <div>
                                <h3 className="font-medium mb-1">일정 관리</h3>
                                <p className="text-muted-foreground text-sm">참여한 매칭의 일정을 확인하고 관리할 수 있습니다.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

