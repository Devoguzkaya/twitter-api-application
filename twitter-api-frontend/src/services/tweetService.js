import axiosClient from '../api/axiosClient';

const tweetService = {
    getAllTweets: async () => {
        const response = await axiosClient.get('/tweet');
        return response.data;
    },

    getTweetById: async (tweetId) => {
        const response = await axiosClient.get(`/tweet/findById/${tweetId}`);
        return response.data;
    },

    getTweetsByUsername: async (username) => {
        const response = await axiosClient.get(`/tweet/user/${username}`);
        return response.data;
    },

    toggleLike: async (tweetId, isLiked) => {
        const url = isLiked
            ? `/like/dislike/${tweetId}`
            : `/like/${tweetId}`;
        return await axiosClient.post(url);
    },

    toggleRetweet: async (tweetId, isRetweeted) => {
        const url = `/retweet/${tweetId}`;
        if (isRetweeted) {
            return await axiosClient.delete(url);
        } else {
            return await axiosClient.post(url);
        }
    },

    deleteTweet: async (tweetId) => {
        return await axiosClient.delete(`/tweet/${tweetId}`);
    },

    updateTweet: async (tweetId, content) => {
        const response = await axiosClient.put(`/tweet/${tweetId}`, { content });
        return response.data;
    },

    postTweet: async (content) => {
        const response = await axiosClient.post('/tweet', { content });
        return response.data;
    }
};

export default tweetService;
