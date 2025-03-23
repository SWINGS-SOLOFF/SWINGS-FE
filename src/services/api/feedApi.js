import axios from 'axios';

const API_BASE = '/api/user';

export const login = async (credentials) => {
    const response = await axios.post(`${API_BASE}/login`, credentials);
    return response.data;
};

export const register = async (userData) => {
    const response = await axios.post(`${API_BASE}/register`, userData);
    return response.data;
};

export const fetchUserProfile = async (userId) => {
    const response = await axios.get(`${API_BASE}/profile/${userId}`);
    return response.data;
};

