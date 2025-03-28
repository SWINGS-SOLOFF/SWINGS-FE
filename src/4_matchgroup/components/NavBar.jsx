import { useState } from "react"
import { ClubIcon as GolfIcon, MenuIcon, UserIcon, XIcon } from "lucide-react"
import {Link} from "react-router-dom";
import Button from "./ui/Button.jsx";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  // 임시 로그인 상태 (실제로는 상태 관리 라이브러리나 컨텍스트를 사용하세요)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    // 실제 로그아웃 로직 구현
    setIsLoggedIn(false)
    closeMenu()
  }

  const navItems = [
    { name: "홈", path: "/" },
    { name: "매칭 목록", path: "/swings/matchgroup" },
    { name: "스크린 매칭", path: "/swings/matchgroup/screen" },
    { name: "필드 매칭", path: "/swings/matchgroup/field" },
  ]

  const isActive = (path) => {
    if (path === "/") {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  return (
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* 로고 */}
            <Link href="/" className="flex items-center space-x-2">
              <GolfIcon className="h-6 w-6 text-golf-green-600" />
              <span className="font-bold text-xl text-golf-green-700">골프 매칭</span>
            </Link>

            {/* 데스크톱 메뉴 */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                  <Link
                      key={item.path}
                      href={item.path}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                          isActive(item.path)
                              ? "bg-golf-green-100 text-golf-green-700"
                              : "text-gray-700 hover:bg-golf-green-50 hover:text-golf-green-600"
                      }`}
                  >
                    {item.name}
                  </Link>
              ))}
            </div>

            {/* 사용자 메뉴 */}
            <div className="hidden md:flex items-center space-x-2">
              {isLoggedIn ? (
                  <>
                    <Link href="/my-matches">
                      <Button variant="ghost" size="sm">
                        내 매칭
                      </Button>
                    </Link>
                    <Link href="/profile">
                      <Button variant="ghost" size="sm">
                        <UserIcon className="h-4 w-4 mr-1" />
                        프로필
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      로그아웃
                    </Button>
                  </>
              ) : (
                  <>
                    <Link href="/login">
                      <Button variant="ghost" size="sm">
                        로그인
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button variant="default" size="sm">
                        회원가입
                      </Button>
                    </Link>
                  </>
              )}
            </div>

            {/* 모바일 메뉴 버튼 */}
            <div className="md:hidden">
              <button
                  onClick={toggleMenu}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-golf-green-600 hover:bg-golf-green-50 focus:outline-none"
              >
                {isMenuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
            <div className="md:hidden bg-white border-t">
              <div className="container mx-auto px-4 py-2 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.path}
                        href={item.path}
                        onClick={closeMenu}
                        className={`block px-3 py-2 rounded-md text-base font-medium ${
                            isActive(item.path)
                                ? "bg-golf-green-100 text-golf-green-700"
                                : "text-gray-700 hover:bg-golf-green-50 hover:text-golf-green-600"
                        }`}
                    >
                      {item.name}
                    </Link>
                ))}
                <div className="pt-4 pb-3 border-t border-gray-200">
                  {isLoggedIn ? (
                      <>
                        <Link
                            href="/my-matches"
                            onClick={closeMenu}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-golf-green-50 hover:text-golf-green-600"
                        >
                          내 매칭
                        </Link>
                        <Link
                            href="/profile"
                            onClick={closeMenu}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-golf-green-50 hover:text-golf-green-600"
                        >
                          프로필
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-golf-green-50 hover:text-golf-green-600"
                        >
                          로그아웃
                        </button>
                      </>
                  ) : (
                      <>
                        <Link
                            href="/login"
                            onClick={closeMenu}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-golf-green-50 hover:text-golf-green-600"
                        >
                          로그인
                        </Link>
                        <Link
                            href="/register"
                            onClick={closeMenu}
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-golf-green-50 hover:text-golf-green-600"
                        >
                          회원가입
                        </Link>
                      </>
                  )}
                </div>
              </div>
            </div>
        )}
      </nav>
  )
}

