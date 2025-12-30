import axiosClient from '../api/axiosClient';

const authService = {
    login: async (username, password) => {
        const token = btoa(`${username}:${password}`);
        const header = `Basic ${token}`;
        // Basic auth header'ı ile user-details endpoint'ine istek at
        const response = await axiosClient.get(`/auth/user-details?username=${username}`, {
            headers: { Authorization: header }
        });
        return { ...response.data, authHeader: header };
    },

    getUserDetails: async (username) => {
        const response = await axiosClient.get(`/auth/user-details?username=${username}`);
        return response.data;
    },

    register: async (userData) => {
        const response = await axiosClient.post('/auth/register', userData);
        return response.data;
    }
};

export default authService;
