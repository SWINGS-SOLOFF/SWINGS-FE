// src/components/UserManagementPage.jsx
import React, { useState } from 'react';

function UserManagementPage() {
    console.log("UserManagementPage 렌더링됨!"); // ← 콘솔 확인용

    // 사용자 데이터 상태
    const [users, setUsers] = useState([
        { id: 1, name: '홍길동', email: 'hong@example.com', status: '활성화' },
        { id: 2, name: '김철수', email: 'kim@example.com', status: '비활성화' },
    ]);

    // 상태 변경 함수
    const toggleStatus = (id) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user.id === id ? { ...user, status: user.status === '활성화' ? '비활성화' : '활성화' } : user
            )
        );
    };

    // 삭제 함수
    const deleteUser = (id) => {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">회원 관리</h2>
            <div className="overflow-x-auto shadow-lg rounded-lg">
                <table className="min-w-full table-auto text-left bg-white">
                    <thead>
                    <tr className="bg-gray-100">
                        <th className="px-4 py-2 text-sm font-medium">이름</th>
                        <th className="px-4 py-2 text-sm font-medium">이메일</th>
                        <th className="px-4 py-2 text-sm font-medium">상태</th>
                        <th className="px-4 py-2 text-sm font-medium">액션</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-b">
                            <td className="px-4 py-2">{user.name}</td>
                            <td className="px-4 py-2">{user.email}</td>
                            <td className="px-4 py-2">{user.status}</td>
                            <td className="px-4 py-2">
                                <button
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => toggleStatus(user.id)}
                                >
                                    {user.status === '활성화' ? '비활성화' : '활성화'}
                                </button>
                                <button
                                    className="ml-4 text-red-600 hover:text-red-800"
                                    onClick={() => deleteUser(user.id)}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserManagementPage;
