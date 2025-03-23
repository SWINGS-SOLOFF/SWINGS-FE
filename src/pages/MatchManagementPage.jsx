
const MatchManagementPage = () => {
    // State for potential matches
    const [potentialMatches, setPotentialMatches] = useState([
        {
            id: 1,
            name: "김민준",
            age: 32,
            handicap: 12,
            experience: "5년",
            location: "서울 강남",
            preferredTime: "주말 오전",
            bio: "취미로 골프를 시작했는데 이제는 주말마다 라운딩을 즐기고 있습니다. 좋은 라운딩 친구를 만나고 싶어요. 드라이버 평균 비거리 250야드, 아이언은 계속 연습 중입니다.",
            profileImage: "/api/placeholder/300/300",
            interests: ["골프 여행", "클럽 피팅", "골프 영상 분석"]
        },
        {
            id: 2,
            name: "이지연",
            age: 28,
            handicap: 15,
            experience: "3년",
            location: "인천 송도",
            preferredTime: "평일 오후",
            bio: "골프를 통해 새로운 인연을 만들고 싶습니다. 평일 오후에 라운딩 가능해요. 스코어보다는 즐겁게 게임하는 것을 중요시합니다. 골프 외에도 테니스와 요가를 즐겨요.",
            profileImage: "/api/placeholder/300/300",
            interests: ["스크린 골프", "골프 패션", "골프 여행"]
        },
        {
            id: 3,
            name: "박상현",
            age: 35,
            handicap: 8,
            experience: "10년",
            location: "경기 용인",
            preferredTime: "주말 종일",
            bio: "대학 때부터 골프를 시작해서 10년 넘게 쳤습니다. 함께 라운딩하면서 서로 기술도 공유하고 좋은 시간 보내실 분을 찾고 있어요. 골프장 추천해 드릴 수 있어요.",
            profileImage: "/api/placeholder/300/300",
            interests: ["골프 클럽 컬렉션", "골프 기술 분석", "골프 대회 관람"]
        },
        {
            id: 4,
            name: "최영희",
            age: 30,
            handicap: 18,
            experience: "1년",
            location: "서울 마포",
            preferredTime: "평일 오전",
            bio: "작년에 골프를 시작했습니다. 아직 많이 배우는 중이지만 열정만큼은 누구보다 크다고 자부합니다. 편안하게 알려주실 수 있는 친구를 찾고 있어요.",
            profileImage: "/api/placeholder/300/300",
            interests: ["골프 레슨", "초보자 라운드", "골프 용품"]
        },
        {
            id: 5,
            name: "정태호",
            age: 40,
            handicap: 10,
            experience: "7년",
            location: "경기 분당",
            preferredTime: "주말 오후",
            bio: "분당에 살고 있는 40대 골퍼입니다. 주로 경기권 골프장을 다니며, 함께 라운딩하면서 즐거운 시간 보내실 분을 찾습니다. 골프 후 간단한 식사와 대화도 좋아합니다.",
            profileImage: "/api/placeholder/300/300",
            interests: ["골프 코스 탐방", "드라이버 연습", "와인"]
        }
    ]);

    // State for current profile being viewed
    const [currentProfileIndex, setCurrentProfileIndex] = useState(0);

    // State for matches (people who both liked each other)
    const [matches, setMatches] = useState([]);

    // State for people the user liked
    const [liked, setLiked] = useState([]);

    // State for conversation view
    const [showConversation, setShowConversation] = useState(false);
    const [currentConversation, setCurrentConversation] = useState(null);

    // State to control profile vs matches view
    const [viewMode, setViewMode] = useState('profiles'); // 'profiles' or 'matches'

    // Messages state
    const [conversations, setConversations] = useState({
        // Example conversation
        3: [
            { sender: 3, text: "안녕하세요! 매칭이 됐네요. 라운딩 한번 같이 하면 좋을 것 같아요.", time: "10:30 AM" },
            { sender: "user", text: "안녕하세요! 네, 저도 그렇게 생각합니다. 주말에 시간 되시나요?", time: "10:35 AM" },
            { sender: 3, text: "이번 주말 토요일 오전이 좋을 것 같아요. 어떠세요?", time: "10:40 AM" }
        ]
    });

    // New message text
    const [newMessage, setNewMessage] = useState("");

    // Function to handle liking a profile
    const handleLike = () => {
        const currentProfile = potentialMatches[currentProfileIndex];
        // In a real app, this would send a request to the server
        // For this demo, let's simulate a match with certain profiles
        if (currentProfile.id === 3 || currentProfile.id === 5) {
            if (!matches.some(match => match.id === currentProfile.id)) {
                setMatches([...matches, currentProfile]);

                // Initialize conversation if it doesn't exist
                if (!conversations[currentProfile.id]) {
                    setConversations({
                        ...conversations,
                        [currentProfile.id]: [
                            {
                                sender: currentProfile.id,
                                text: `안녕하세요! ${currentProfile.name}입니다. 매칭이 됐네요. 함께 라운딩 해보면 좋을 것 같아요.`,
                                time: formatTime(new Date())
                            }
                        ]
                    });
                }
            }
        }

        setLiked([...liked, currentProfile.id]);

        // Move to next profile
        if (currentProfileIndex < potentialMatches.length - 1) {
            setCurrentProfileIndex(currentProfileIndex + 1);
        }
    };

    // Function to handle disliking a profile
    const handleDislike = () => {
        // Move to next profile
        if (currentProfileIndex < potentialMatches.length - 1) {
            setCurrentProfileIndex(currentProfileIndex + 1);
        }
    };

    // Function to format time
    const formatTime = (date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Function to handle sending a message
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        const updatedConversations = {
            ...conversations,
            [currentConversation.id]: [
                ...(conversations[currentConversation.id] || []),
                {
                    sender: "user",
                    text: newMessage,
                    time: formatTime(new Date())
                }
            ]
        };

        setConversations(updatedConversations);
        setNewMessage("");

        // Simulate a response after a short delay
        setTimeout(() => {
            const responses = [
                "네, 좋습니다! 언제 시간 괜찮으세요?",
                "저도 같은 생각이에요. 어떤 골프장을 선호하시나요?",
                "더 자세한 이야기 나눠봐요. 골프 스타일이 어떻게 되시나요?",
                "좋아요! 연락처 교환하고 구체적인 일정 잡아봐요."
            ];

            if (!currentConversation) return;

            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            setConversations({
                ...updatedConversations,
                [currentConversation.id]: [
                    ...updatedConversations[currentConversation.id],
                    {
                        sender: currentConversation.id,
                        text: randomResponse,
                        time: formatTime(new Date())
                    }
                ]
            });
        }, 1000);
    };

    // Function to open a conversation
    const openConversation = (match) => {
        setCurrentConversation(match);
        setShowConversation(true);
    };

    // Effect to handle when we run out of profiles
    useEffect(() => {
        if (currentProfileIndex >= potentialMatches.length) {
            // No more profiles to show
            setViewMode('matches');
        }
    }, [currentProfileIndex, potentialMatches.length]);

    return (
        <div className="py-8">
            <h1 className="text-3xl font-bold text-green-800 mb-8 flex items-center">
                <FaGolfBall className="mr-2" /> 골프 파트너 매칭
            </h1>

            {/* View toggle */}
            <div className="flex mb-6">
                <button
                    onClick={() => setViewMode('profiles')}
                    className={`flex-1 py-2 text-center ${viewMode === 'profiles' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'} rounded-l-lg transition-colors`}
                >
                    프로필 보기
                </button>
                <button
                    onClick={() => {
                        setViewMode('matches');
                        setShowConversation(false);
                    }}
                    className={`flex-1 py-2 text-center ${viewMode === 'matches' ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'} rounded-r-lg transition-colors relative`}
                >
                    매칭 목록
                    {matches.length > 0 && (
                        <span className="absolute top-1 right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {matches.length}
            </span>
                    )}
                </button>
            </div>

            {/* Main content area */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
                {viewMode === 'profiles' && currentProfileIndex < potentialMatches.length && (
                    <div className="max-w-md mx-auto">
                        <div className="aspect-w-3 aspect-h-4 mb-4">
                            <img
                                src={potentialMatches[currentProfileIndex].profileImage}
                                alt={potentialMatches[currentProfileIndex].name}
                                className="w-full h-64 object-cover rounded-lg shadow-md"
                            />
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="text-2xl font-semibold text-green-800">
                                    {potentialMatches[currentProfileIndex].name}, {potentialMatches[currentProfileIndex].age}
                                </h2>
                                <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                                    핸디캡 {potentialMatches[currentProfileIndex].handicap}
                                </div>
                            </div>

                            <div className="flex items-center text-gray-600 mb-2">
                                <FaMapMarkerAlt className="mr-1 text-green-500" />
                                <span>{potentialMatches[currentProfileIndex].location}</span>
                                <span className="mx-2">•</span>
                                <FaCalendarAlt className="mr-1 text-green-500" />
                                <span>{potentialMatches[currentProfileIndex].preferredTime}</span>
                                <span className="mx-2">•</span>
                                <FaTrophy className="mr-1 text-green-500" />
                                <span>경력 {potentialMatches[currentProfileIndex].experience}</span>
                            </div>

                            <p className="text-gray-700 mb-4">{potentialMatches[currentProfileIndex].bio}</p>

                            <div className="mb-4">
                                <h3 className="text-md font-medium text-green-700 mb-2">관심사</h3>
                                <div className="flex flex-wrap gap-2">
                                    {potentialMatches[currentProfileIndex].interests.map((interest, index) => (
                                        <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                      {interest}
                    </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center gap-6">
                            <button
                                onClick={handleDislike}
                                className="bg-red-100 hover:bg-red-200 text-red-600 rounded-full p-4 shadow transition-colors"
                            >
                                <FaTimes size={24} />
                            </button>
                            <button
                                onClick={handleLike}
                                className="bg-green-100 hover:bg-green-200 text-green-600 rounded-full p-4 shadow transition-colors"
                            >
                                <FaHeart size={24} />
                            </button>
                        </div>

                        <div className="text-center mt-4 text-gray-500 text-sm">
                            {currentProfileIndex + 1} / {potentialMatches.length}
                        </div>
                    </div>
                )}

                {viewMode === 'profiles' && currentProfileIndex >= potentialMatches.length && (
                    <div className="text-center py-12">
                        <FaGolfBall size={48} className="mx-auto text-green-500 mb-4" />
                        <h2 className="text-2xl font-semibold text-green-800 mb-2">프로필을 모두 확인했습니다!</h2>
                        <p className="text-gray-600 mb-6">현재 더 이상 표시할 프로필이 없습니다. 나중에 다시 확인해주세요.</p>
                        <button
                            onClick={() => setViewMode('matches')}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                            매칭 목록 보기 ({matches.length})
                        </button>
                    </div>
                )}

                {viewMode === 'matches' && !showConversation && (
                    <div>
                        <h2 className="text-xl font-semibold text-green-700 mb-4 flex items-center">
                            <FaHeart className="mr-2 text-red-500" /> 내 매칭 목록
                        </h2>

                        {matches.length === 0 ? (
                            <div className="text-center py-8 text-gray-600">
                                <FaInfoCircle size={32} className="mx-auto text-gray-400 mb-3" />
                                <p>아직 매칭된 파트너가 없습니다.</p>
                                <p className="mt-2">프로필을 더 확인하고 마음에 드는 파트너를 찾아보세요!</p>
                                {currentProfileIndex < potentialMatches.length && (
                                    <button
                                        onClick={() => setViewMode('profiles')}
                                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        프로필 더 보기
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {matches.map(match => (
                                    <div key={match.id} className="border border-green-200 rounded-lg p-4 hover:bg-green-50 transition-colors">
                                        <div className="flex items-center">
                                            <img
                                                src={match.profileImage}
                                                alt={match.name}
                                                className="w-16 h-16 object-cover rounded-full mr-4"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-green-800">{match.name}, {match.age}</h3>
                                                <div className="text-sm text-gray-600">핸디캡: {match.handicap} • 경력: {match.experience}</div>
                                                <div className="text-sm text-gray-600">{match.location}</div>
                                            </div>
                                            <button
                                                onClick={() => openConversation(match)}
                                                className="bg-green-600 hover:bg-green-700 text-white rounded-full p-2 transition-colors"
                                            >
                                                <FaComments size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {showConversation && currentConversation && (
                    <div>
                        <div className="flex items-center mb-4">
                            <button
                                onClick={() => setShowConversation(false)}
                                className="mr-4 text-green-600 hover:text-green-800"
                            >
                                &larr; 뒤로
                            </button>
                            <img
                                src={currentConversation.profileImage}
                                alt={currentConversation.name}
                                className="w-10 h-10 object-cover rounded-full mr-3"
                            />
                            <div>
                                <h3 className="font-medium text-green-800">{currentConversation.name}</h3>
                                <div className="text-xs text-gray-500">{currentConversation.location} • 핸디캡 {currentConversation.handicap}</div>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 h-96 overflow-y-auto mb-4">
                            {conversations[currentConversation.id]?.map((message, index) => (
                                <div
                                    key={index}
                                    className={`mb-3 ${message.sender === "user" ? "text-right" : "text-left"}`}
                                >
                                    <div
                                        className={`inline-block px-4 py-2 rounded-lg ${
                                            message.sender === "user"
                                                ? "bg-green-600 text-white rounded-br-none"
                                                : "bg-gray-200 text-gray-800 rounded-bl-none"
                                        }`}
                                    >
                                        {message.text}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {message.time}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSendMessage} className="flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="메시지를 입력하세요..."
                                className="flex-1 px-4 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                보내기
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MatchManagementPage;