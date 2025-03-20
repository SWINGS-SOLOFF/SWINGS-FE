import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="max-w-4xl mx-auto text-center">
            <div className="mb-10">
                <h1 className="text-5xl font-bold text-primary mb-4">골프 커넥트</h1>
                <p className="text-xl text-text-light mb-8">프리미엄 골프 매칭 서비스로 새로운 골프 라이프를 경험하세요</p>

                <div className="bg-surface rounded-lg shadow-lg p-8 mb-12">
                    <img
                        src="/api/placeholder/800/400"
                        alt="골프 코스"
                        className="w-full h-auto rounded-lg mb-8 object-cover"
                    />

                    <p className="text-lg mb-8 leading-relaxed">
                        골프 커넥트는 당신의 골프 경험을 한 단계 높여드립니다. 실력과 성향이 맞는 골프 파트너를 찾고,
                        명문 골프장에서 특별한 라운딩을 예약하며, 골프 커뮤니티에서 당신만의 골프 여정을 공유해보세요.
                    </p>

                    <Link to="/feed" className="btn-primary inline-block mb-4 mx-3 px-8 py-3 text-lg">
                        골프 피드 둘러보기
                    </Link>
                    <Link to="/match-management" className="btn-secondary inline-block mb-4 mx-3 px-8 py-3 text-lg">
                        매치 찾기
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="card text-center p-8 hover:shadow-lg transition duration-300">
                    <div className="flex justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold mb-3">맞춤형 파트너 매칭</h2>
                    <p className="text-text-light">핸디캡, 라운딩 스타일, 성향이 맞는 골프 파트너를 AI 매칭 시스템으로 찾아드립니다.</p>
                </div>

                <div className="card text-center p-8 hover:shadow-lg transition duration-300">
                    <div className="flex justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold mb-3">프리미엄 모임 관리</h2>
                    <p className="text-text-light">회원제 골프장 티타임 예약부터 단체 모임 편성까지, 골프 라운드를 위한 모든 준비를 도와드립니다.</p>
                </div>

                <div className="card text-center p-8 hover:shadow-lg transition duration-300">
                    <div className="flex justify-center mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold mb-3">골프 커뮤니티</h2>
                    <p className="text-text-light">라운딩 후기, 스윙 영상, 골프 팁까지 다양한 골프 콘텐츠를 공유하는 프리미엄 커뮤니티입니다.</p>
                </div>
            </div>

            <div className="bg-surface rounded-lg shadow-lg p-8 mb-12">
                <h2 className="text-3xl font-bold text-primary mb-6">특별한 골프 라이프를 위한 선택</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-left">
                        <h3 className="text-xl font-semibold mb-3">프리미엄 매칭 시스템</h3>
                        <ul className="list-disc list-inside mb-4 text-text-light">
                            <li>핸디캡과 실력을 고려한 맞춤형 매칭</li>
                            <li>성격과 라운딩 스타일이 맞는 파트너 추천</li>
                            <li>선호하는 골프장과 라운딩 일정 조율</li>
                            <li>정기 모임 및 대회 참여 기회</li>
                        </ul>
                    </div>
                    <div className="text-left">
                        <h3 className="text-xl font-semibold mb-3">회원 전용 혜택</h3>
                        <ul className="list-disc list-inside mb-4 text-text-light">
                            <li>유명 골프장 우대 예약 및 할인</li>
                            <li>프로 골퍼의 원포인트 레슨</li>
                            <li>골프 장비 및 의류 특별 할인</li>
                            <li>시즌별 회원 전용 이벤트 초대</li>
                        </ul>
                    </div>
                </div>
                <Link to="/user-management" className="btn-primary inline-block mt-4 px-8 py-3 text-lg">
                    지금 회원가입하기
                </Link>
            </div>

            <div className="rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">믿을 수 있는 골프 파트너</h2>
                <div className="flex flex-wrap justify-center gap-8 mb-6">
                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-2"></div>
                        <p className="font-medium">김태희 프로</p>
                        <p className="text-sm text-text-light">KPGA 투어 프로</p>
                    </div>
                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-2"></div>
                        <p className="font-medium">골든베어 GC</p>
                        <p className="text-sm text-text-light">제휴 골프장</p>
                    </div>
                    <div className="text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto mb-2"></div>
                        <p className="font-medium">테일러메이드</p>
                        <p className="text-sm text-text-light">장비 파트너</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;