import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaHeart, FaRegHeart, FaComment, FaTrash, FaGolfBall,
    FaMapMarkerAlt, FaTrophy, FaCalendarAlt, FaEdit, FaUserMinus, FaUserPlus
} from 'react-icons/fa';

const SocialPage = () => {
    // Core state management
    const [feeds, setFeeds] = useState([]);
    const [comments, setComments] = useState({});
    const [newComments, setNewComments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userintroduce, setUserintroduce] = useState('');
    const [userStats, setUserStats] = useState({ posts: 0, followers: 0, following: 0 });
    const [editingintroduce, setEditingintroduce] = useState(false);
    const [introduceInput, setintroduceInput] = useState('');

    const [isFollowing, setIsFollowing] = useState(false);

    // Temporary current user information
    const currentUser = {
        userId: 1,
        username: '골프매니아',
        profilePic: 'https://via.placeholder.com/100',
        handicap: 15,
        location: '서울시 강남구',
        joinDate: '2023년 5월',
        bestScore: 82
    };

    // Viewed user ID (could be dynamic in a real app)
    const viewedUserId = currentUser.userId;

    // Fetch all required data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([fetchUserData(), fetchFeeds(), checkFollowStatus()]);
                setLoading(false);
            } catch (err) {
                console.error('Error loading data:', err);
                setError('데이터를 불러오는 데 실패했습니다. 나중에 다시 시도해주세요.');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Check follow status
    const checkFollowStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8090/swings/social/isFollowing', {
                params: {
                    followerId: currentUser.userId,
                    followeeId: viewedUserId
                }
            });
            setIsFollowing(response.data === '팔로우 중입니다.');
        } catch (err) {
            console.error('Error checking follow status:', err);
        }
    };

    // Handle follow/unfollow action
    const handleFollowToggle = async () => {
        try {
            const endpoint = isFollowing
                ? 'http://localhost:8090/swings/social/unfollow'
                : 'http://localhost:8090/swings/social/follow';

            await axios.post(endpoint, {
                followerId: currentUser.userId,
                followeeId: viewedUserId
            });

            // Update follow status and user stats
            setIsFollowing(!isFollowing);
            setUserStats(prev => ({
                ...prev,
                followers: isFollowing
                    ? prev.followers - 1
                    : prev.followers + 1
            }));
        } catch (err) {
            console.error('Error toggling follow status:', err);
            alert('팔로우/언팔로우 중 오류가 발생했습니다.');
        }
    };

    // Handle introduce update
    const handleintroduceUpdate = async () => {
        if (introduceInput === userintroduce) {
            setEditingintroduce(false);
            return;
        }

        try {
            await axios.post(`http://localhost:8090/swings/social/update-introduce`, introduceInput, {
                params: {
                    userId: currentUser.userId
                },
                headers: {
                    'Content-Type': 'text/plain'
                }
            });

            setUserintroduce(introduceInput);
            setEditingintroduce(false);
        } catch (err) {
            console.error('Error updating introduce:', err);
            alert('자기소개 업데이트 중 오류가 발생했습니다.');
        }
    };