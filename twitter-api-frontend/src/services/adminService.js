import axiosClient from '../api/axiosClient';

const adminService = {
    getAllUsers: async () => {
        const response = await axiosClient.get('/admin/users');
        return response.data;
    }
};

export default adminService;
