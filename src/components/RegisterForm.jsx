// src/components/RegisterForm.jsx
import React from 'react';

const RegisterForm = () => {
    return (
        <div className="register-form-container">
            <h2 className="text-xl font-semibold text-center text-green-700 mb-4">회원가입</h2>

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
    );
};

export default RegisterForm;