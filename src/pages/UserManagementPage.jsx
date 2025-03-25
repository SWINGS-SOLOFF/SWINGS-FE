import React, { useState } from 'react';
import { FaGolfBall, FaUser, FaCalendarAlt, FaMapMarkerAlt, FaUserPlus, FaCrown } from 'react-icons/fa';

const MatchManagementPage = () => {
    // Sample data for existing matches
    const [matches, setMatches] = useState([
        {
            id: 1,
            title: "주말 라운딩 모임",
            course: "골든밸리 CC",
            date: "2025-03-22",
            time: "07:30",
            maxPlayers: 4,
            description: "토요일 아침 라운딩입니다. 평균 타수 90 이하 분들 환영합니다.",
            host: {
                id: 101,
                name: "김프로",
                handicap: 12.5,
                averageScore: 85,
                playYears: 5,
                profileImage: "/api/placeholder/60/60"
            },
            players: [
                {
                    id: 101,
                    name: "김프로",
                    handicap: 12.5,
                    averageScore: 85,
                    playYears: 5,
                    profileImage: "/api/placeholder/60/60"
                },
                {
                    id: 102,
                    name: "이버디",
                    handicap: 15.2,
                    averageScore: 88,
                    playYears: 3,
                    profileImage: "/api/placeholder/60/60"
                }
            ]
        },
        {
            id: 2,
            title: "초보 환영 친목 라운딩",
            course: "서울 그랜드 CC",
            date: "2025-03-23",
            time: "13:00",
            maxPlayers: 4,
            description: "즐겁게 라운드 하실 분들 모집합니다. 초보자 환영, 실력보다 매너를 중요시합니다.",
            host: {
                id: 103,
                name: "박홀인원",
                handicap: 20.5,
                averageScore: 95,
                playYears: 2,
                profileImage: "/api/placeholder/60/60"
            },
            players: [
                {
                    id: 103,
                    name: "박홀인원",
                    handicap: 20.5,
                    averageScore: 95,
                    playYears: 2,
                    profileImage: "/api/placeholder/60/60"
                },
                {
                    id: 104,
                    name: "최이글",
                    handicap: 18.7,
                    averageScore: 92,
                    playYears: 2,
                    profileImage: "/api/placeholder/60/60"
                },
                {
                    id: 105,
                    name: "정파",
                    handicap: 25.0,
                    averageScore: 100,
                    playYears: 1,
                    profileImage: "/api/placeholder/60/60"
                }
            ]
        },
        {
            id: 3,
            title: "평일 오후 라운딩",
            course: "레이크사이드 CC",
            date: "2025-03-20",
            time: "14:00",
            maxPlayers: 4,
            description: "평일 오후에 여유있게 라운드하실 분 구합니다. 골프 매너만 지켜주세요.",
            host: {
                id: 106,
                name: "정드라이버",
                handicap: 16.3,
                averageScore: 89,
                playYears: 4,
                profileImage: "/api/placeholder/60/60"
            },
            players: [
                {
                    id: 106,
                    name: "정드라이버",
                    handicap: 16.3,
                    averageScore: 89,
                    playYears: 4,
                    profileImage: "/api/placeholder/60/60"
                }
            ]
        }
    ]);

    // State for new match form
    const [showNewMatchForm, setShowNewMatchForm] = useState(false);
    const [newMatch, setNewMatch] = useState({
        title: "",
        course: "",
        date: "",
        time: "",
        description: "",
        maxPlayers: 4
    });

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMatch(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app, you would send this to your backend
        const createdMatch = {
            id: matches.length + 1,
            ...newMatch,
            host: {
                id: 999, // This would be the logged-in user's ID
                name: "현재 사용자",
                handicap: 14.7,
                averageScore: 87,
                playYears: 3,
                profileImage: "/api/placeholder/60/60"
            },
            players: [{
                id: 999, // This would be the logged-in user's ID
                name: "현재 사용자",
                handicap: 14.7,
                averageScore: 87,
                playYears: 3,
                profileImage: "/api/placeholder/60/60"
            }]
        };

        setMatches([createdMatch, ...matches]);
        setShowNewMatchForm(false);
        setNewMatch({
            title: "",
            course: "",
            date: "",
            time: "",
            description: "",
            maxPlayers: 4
        });
    };

    // Join a match
    const handleJoinMatch = (matchId) => {
        // In a real app, you would send this to your backend
        setMatches(matches.map(match => {
            if (match.id === matchId && match.players.length < match.maxPlayers) {
                return {
                    ...match,
                    players: [...match.players, {
                        id: 999, // This would be the logged-in user's ID
                        name: "현재 사용자",
                        handicap: 14.7,
                        averageScore: 87,
                        playYears: 3,
                        profileImage: "/api/placeholder/60/60"
                    }]
                };
            }
            return match;
        }));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-bold text-primary mb-4">골프 모임 관리</h1>
                <p className="text-lg text-text-light mb-8">
                    함께 라운딩할 친구를 찾아보세요. 최대 4명까지 모일 수 있습니다.
                </p>

                <button
                    onClick={() => setShowNewMatchForm(!showNewMatchForm)}
                    className="btn-primary inline-block mb-8 px-6 py-3"
                >
                    {showNewMatchForm ? "취소하기" : "새 모임 만들기"}
                </button>

                {showNewMatchForm && (
                    <div className="bg-surface rounded-lg shadow-lg p-6 mb-10">
                        <h2 className="text-2xl font-semibold text-primary mb-6">새 골프 모임 만들기</h2>
                        <form onSubmit={handleSubmit} className="text-left">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-text-light mb-2">모임 제목</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newMatch.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-text-light mb-2">골프장</label>
                                    <input
                                        type="text"
                                        name="course"
                                        value={newMatch.course}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-text-light mb-2">날짜</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={newMatch.date}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-text-light mb-2">시간</label>
                                    <input
                                        type="time"
                                        name="time"
                                        value={newMatch.time}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-text-light mb-2">모임 설명</label>
                                <textarea
                                    name="description"
                                    value={newMatch.description}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border border-gray-300 rounded h-24"
                                    placeholder="모임에 대한 설명과 참가자들이 알아야 할 정보를 적어주세요."
                                    required
                                ></textarea>
                            </div>
                            <div className="text-center">
                                <button type="submit" className="btn-primary px-8 py-2">
                                    모임 생성하기
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {matches.map(match => (
                    <div key={match.id} className="bg-surface rounded-lg shadow-lg overflow-hidden border border-gray-200">
                        {/* Match Header */}
                        <div className="bg-primary text-white p-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">{match.title}</h2>
                                <div className="text-sm">
                                    <span className="bg-white text-primary px-2 py-1 rounded-full">
                                        {match.players.length}/{match.maxPlayers} 명
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Match Details */}
                        <div className="p-4 bg-gray-50 border-b border-gray-200">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                                <div className="flex items-center mb-2 md:mb-0">
                                    <FaMapMarkerAlt className="mr-2 text-primary" />
                                    <span>{match.course}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaCalendarAlt className="mr-2 text-primary" />
                                    <span>{match.date} {match.time}</span>
                                </div>
                            </div>
                        </div>

                        {/* Match Description */}
                        <div className="p-4 border-b border-gray-200">
                            <p>{match.description}</p>
                        </div>

                        {/* Players Section */}
                        <div className="p-4">
                            <h3 className="font-semibold mb-3 text-gray-700">참가자 정보</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Current players */}
                                {match.players.map((player, index) => (
                                    <div key={player.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                        <div className="flex items-center mb-2">
                                            <img
                                                src={player.profileImage}
                                                alt={player.name}
                                                className="w-10 h-10 rounded-full mr-3"
                                            />
                                            <div>
                                                <div className="flex items-center">
                                                    <span className="font-medium">{player.name}</span>
                                                    {player.id === match.host.id && (
                                                        <FaCrown className="ml-1 text-yellow-500" title="방장" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">{player.playYears}년차</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="bg-white p-1 rounded border border-gray-200 text-center">
                                                <span className="block text-xs text-gray-500">핸디캡</span>
                                                <span className="font-semibold">{player.handicap}</span>
                                            </div>
                                            <div className="bg-white p-1 rounded border border-gray-200 text-center">
                                                <span className="block text-xs text-gray-500">평균타수</span>
                                                <span className="font-semibold">{player.averageScore}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Empty slots */}
                                {Array.from({ length: match.maxPlayers - match.players.length }).map((_, index) => (
                                    <div key={`empty-${index}`} className="bg-gray-50 rounded-lg p-3 border border-dashed border-gray-300 flex items-center justify-center min-h-24">
                                        <button
                                            onClick={() => handleJoinMatch(match.id)}
                                            className="text-primary hover:text-primary-dark flex flex-col items-center"
                                        >
                                            <FaUserPlus className="text-2xl mb-1" />
                                            <span className="text-sm">참가하기</span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Match Actions */}
                        <div className="p-4 bg-gray-50 flex justify-end">
                            {match.players.length < match.maxPlayers && !match.players.some(p => p.id === 999) && (
                                <button
                                    onClick={() => handleJoinMatch(match.id)}
                                    className="btn-primary px-4 py-2"
                                >
                                    참가 신청하기
                                </button>
                            )}
                            {match.players.some(p => p.id === 999) && (
                                <button className="btn-secondary px-4 py-2">
                                    참가 취소
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MatchManagementPage;