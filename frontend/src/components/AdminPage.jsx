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

                    {showLogin ? (
                        <div className="login-form-container">
                            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">로그인</h2>

                            {/* 로그인 폼 */}
                            <form className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                            로그인 상태 유지
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <a href="#" className="font-medium text-green-600 hover:text-green-500">
                                            비밀번호 찾기
                                        </a>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        로그인
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">또는</span>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <div>
                                        <a
                                            href="#"
                                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">카카오로 로그인</span>
                                            <svg className="h-5 w-5" fill="#FEE500" viewBox="0 0 24 24" aria-hidden="true">
                                                <path fillRule="evenodd" d="M12 2C6.477 2 2 5.764 2 10.325c0 2.594 1.726 4.879 4.312 6.193-.188.731-.727 2.633-.838 3.041-.133.484.145.484.31.347.12-.1 1.893-1.283 2.663-1.818.608.088 1.235.136 1.87.136 5.523 0 10-3.764 10-8.325S17.523 2 12 2z" clipRule="evenodd" />
                                            </svg>
                                        </a>
                                    </div>

                                    <div>
                                        <a
                                            href="#"
                                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                        >
                                            <span className="sr-only">Google로 로그인</span>
                                            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4285F4" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="register-form-container">
                            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">회원가입</h2>

                            {/* 회원가입 폼 */}
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                                        <input
                                            type="text"
                                            id="first-name"
                                            name="first-name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        >
                                            <option value="">선택</option>
                                            <option value="male">남성</option>
                                            <option value="female">여성</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                                    <input
                                        type="email"
                                        id="reg-email"
                                        name="email"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                                    <input
                                        type="password"
                                        id="reg-password"
                                        name="password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <p className="mt-1 text-xs text-gray-500">8자 이상, 숫자와 특수문자 포함</p>
                                </div>

                                <div>
                                    <label htmlFor="golf-level" className="block text-sm font-medium text-gray-700 mb-1">골프 수준</label>
                                    <select
                                        id="golf-level"
                                        name="golf-level"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                        required
                                    >
                                        <option value="">선택</option>
                                        <option value="beginner">입문 (1년 미만)</option>
                                        <option value="intermediate">초급 (1-3년)</option>
                                        <option value="advanced">중급 (3-5년)</option>
                                        <option value="expert">고급 (5년 이상)</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                        required
                                    />
                                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                                        <span>서비스 이용약관 및 </span>
                                        <a href="#" className="font-medium text-green-600 hover:text-green-500">개인정보 처리방침</a>
                                        <span>에 동의합니다</span>
                                    </label>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        회원가입
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
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