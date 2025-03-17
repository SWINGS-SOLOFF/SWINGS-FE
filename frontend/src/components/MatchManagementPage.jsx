// src/components/MatchManagementPage.jsx
import React, { useState } from 'react';

function MatchManagementPage() {
    console.log("MatchManagementPage 렌더링됨!"); // ← 콘솔 확인용

    // 매칭 데이터 상태
    const [matches, setMatches] = useState([
        { id: 1, player1: '홍길동', player2: '김철수', date: '2025년 5월 10일', status: '대기 중' },
        { id: 2, player1: '이순신', player2: '박지민', date: '2025년 5월 12일', status: '승인 완료' },
    ]);

    // 매칭 상태 변경 함수
    const handleApprove = (id) => {
        setMatches(prevMatches =>
            prevMatches.map(match =>
                match.id === id ? { ...match, status: '승인 완료' } : match
            )
        );
    };

    const handleReject = (id) => {
        setMatches(prevMatches =>
            prevMatches.map(match =>
                match.id === id ? { ...match, status: '매칭 거절' } : match
            )
        );
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">매칭 관리</h2>
            <div className="space-y-4">
                {matches.map((match) => (
                    <div key={match.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold">{match.player1} vs {match.player2}</h3>
                        <p className="text-sm text-gray-600">매칭 날짜: {match.date}</p>
                        <p className="text-sm text-gray-600">매칭 상태: {match.status}</p>
                        {match.status === '대기 중' && (
                            <div className="mt-4">
                                <button
                                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all"
                                    onClick={() => handleApprove(match.id)}
                                >
                                    매칭 승인
                                </button>
                                <button
                                    className="ml-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all"
                                    onClick={() => handleReject(match.id)}
                                >
                                    매칭 거절
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MatchManagementPage;
