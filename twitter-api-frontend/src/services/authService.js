import axiosClient from '../api/axiosClient';

const authService = {
    login: async (credentials) => {
        // Login işlemi şuan Basic auth header oluşturularak manuel yapılıyor ama ileride burası kullanılabilir.
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
