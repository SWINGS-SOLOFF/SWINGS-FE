// src/components/HomePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const HomePage = () => {
    // 상태 관리: 로그인 또는 회원가입 폼 표시 여부
    const [showLogin, setShowLogin] = useState(true);

    // 폼 전환 함수
    const toggleForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div className="w-full max-w-4xl">
            {/* 상단 헤더 섹션 */}
            <header className="text-center mb-8">
                <h1 className="text-4xl font-bold text-green-700 mb-2">Green Match</h1>
                <p className="text-lg text-green-600">골프 모임과 소개팅을 한번에</p>
            </header>

            {/* 메인 콘텐츠 영역 */}
            <div className="flex flex-col md:flex-row gap-8">
                {/* 좌측: 앱 소개 영역 */}
                <div className="flex-1 bg-green-50 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-green-700 mb-4">골프로 시작하는 새로운 만남</h2>

                    <div className="mb-6">
                        <h3 className="text-xl font-medium text-green-600 mb-2">서비스 특징</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start">
                <span className="inline-block bg-green-500 rounded-full p-1 mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                                <span>취미가 같은 사람들과의 자연스러운 만남</span>
                            </li>
                            <li className="flex items-start">
                <span className="inline-block bg-green-500 rounded-full p-1 mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                                <span>실력과 관심사에 맞는 맞춤형 매칭</span>
                            </li>
                            <li className="flex items-start">
                <span className="inline-block bg-green-500 rounded-full p-1 mr-2 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                                <span>온라인에서 시작해 필드에서 이어지는 인연</span>
                            </li>
                        </ul>
                    </div>

                    {/* 앱 이미지 (골프 필드 이미지) */}
                    <div className="rounded-lg overflow-hidden shadow-lg bg-green-100 h-48 flex items-center justify-center mb-4">
                        <div className="text-green-700 text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                            <p className="text-sm font-medium">골프장 이미지</p>
                        </div>
                    </div>

                    {/* 앱 통계 */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="bg-green-200 p-2 rounded">
                            <p className="text-2xl font-bold text-green-800">5,000+</p>
                            <p className="text-xs text-green-700">활성 회원</p>
                        </div>
                        <div className="bg-green-200 p-2 rounded">
                            <p className="text-2xl font-bold text-green-800">250+</p>
                            <p className="text-xs text-green-700">월간 매칭</p>
                        </div>
                        <div className="bg-green-200 p-2 rounded">
                            <p className="text-2xl font-bold text-green-800">98%</p>
                            <p className="text-xs text-green-700">만족도</p>
                        </div>
                    </div>
                </div>

                {/* 우측: 로그인/회원가입 폼 영역 */}
                <div className="flex-1 bg-white p-6 rounded-lg shadow-md border border-green-200">
                    <div className="flex justify-center mb-6">
                        <button
                            onClick={() => setShowLogin(true)}
                            className={`px-4 py-2 rounded-l-lg font-medium ${showLogin ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
                        >
                            로그인
                        </button>
                        <button
                            onClick={() => setShowLogin(false)}
                            className={`px-4 py-2 rounded-r-lg font-medium ${!showLogin ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700'}`}
                        >
                            회원가입
                        </button>
                    </div>

                    {showLogin ? <LoginForm /> : <RegisterForm />}
                </div>
            </div>

            {/* 하단 푸터 영역 */}
            <footer className="mt-12 text-center text-sm text-gray-500">
                <p>&copy; 2025 Green Match. All rights reserved.</p>
                <div className="mt-2">
                    <a href="#" className="text-green-600 hover:text-green-500 mx-2">이용약관</a>
                    <a href="#" className="text-green-600 hover:text-green-500 mx-2">개인정보 처리방침</a>
                    <a href="#" className="text-green-600 hover:text-green-500 mx-2">문의하기</a>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;