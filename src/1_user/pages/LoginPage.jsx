// src/1_user/pages/LoginPage.jsx
import Button from "../../components/Button";

const LoginPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">로그인</h1>
            <input type="text" placeholder="이메일" className="border p-2 rounded-md" />
            <input type="password" placeholder="비밀번호" className="border p-2 rounded-md mt-2" />
            <Button className="mt-4">로그인</Button>
        </div>
    );
};

export default LoginPage;
