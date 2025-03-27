import axios from "axios";

const BASE_URL = "http://localhost:8090/swings/matchgroup"

    // 그룹 생성 API
    export const createMatchGroup = async (groupData) => {
            const response = await axios.post(`${BASE_URL}/create`, groupData);
            return response.data;
    };

    // 모든 그룹 조회 API
    export const getAllMatchGroups = async () => {
        const response = await axios.get(`${BASE_URL}/list`);
        console.log("API 응답:", response)
        return response.data;
    };

    // 특정 그룹 조회 API
    export const getMatchGroupById = async (groupId) => {
        const response = await axios.get(`${BASE_URL}/${groupId}`);
        return response.data;
    };