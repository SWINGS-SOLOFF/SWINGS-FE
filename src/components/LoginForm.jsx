// src/components/LoginForm.jsx
import React from 'react';

const LoginForm = () => {
    return (
        <div className="login-form-container">
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">로그인</h2>

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
    );
};

export default LoginForm;
