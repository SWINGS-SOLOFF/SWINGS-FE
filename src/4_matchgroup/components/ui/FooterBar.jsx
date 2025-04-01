import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* 상단 섹션 - 로고와 내비게이션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 회사 정보 섹션 */}
          <div className="mb-6 md:mb-0">
            <h2 className="text-xl font-bold mb-4">회사명</h2>
            <p className="text-gray-300 mb-4">
              고객에게 최상의 서비스와 제품을 제공하기 위해 항상 노력하고
              있습니다.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* 빠른 링크 섹션 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  홈
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  서비스
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  제품
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  회사 소개
                </a>
              </li>
            </ul>
          </div>

          {/* 고객 지원 섹션 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">고객 지원</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  고객센터
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  개인정보처리방침
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  이용약관
                </a>
              </li>
            </ul>
          </div>

          {/* 뉴스레터 구독 섹션 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">뉴스레터 구독</h3>
            <p className="text-gray-300 mb-4">
              최신 소식과 프로모션 정보를 받아보세요.
            </p>
            <form className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="이메일 주소"
                className="px-4 py-2 rounded-md focus:outline-none text-gray-800 flex-grow"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition duration-300">
                구독하기
              </button>
            </form>
          </div>
        </div>

        {/* 구분선 */}
        <hr className="my-8 border-gray-600" />

        {/* 하단 섹션 - 저작권 및 추가 링크 */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-300">
          <p className="mb-4 md:mb-0">
            © {new Date().getFullYear()} 회사명. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-white">
              이용약관
            </a>
            <a href="#" className="hover:text-white">
              쿠키 정책
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
