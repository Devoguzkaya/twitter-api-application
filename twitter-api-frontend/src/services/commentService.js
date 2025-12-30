import axiosClient from '../api/axiosClient';

const commentService = {
    getCommentsByTweetId: async (tweetId) => {
        const response = await axiosClient.get(`/comment/tweet/${tweetId}`);
        return response.data;
    },

    postComment: async (tweetId, content) => {
        const response = await axiosClient.post(`/comment/${tweetId}`, { content });
        return response.data;
    },

    deleteComment: async (commentId) => {
        return await axiosClient.delete(`/comment/${commentId}`);
    },

    updateComment: async (commentId, content) => {
        const response = await axiosClient.put(`/comment/${commentId}`, { content });
        return response.data;
    }
};

export default commentService;
