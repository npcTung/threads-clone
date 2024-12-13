import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  withCredentials: true,
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    // Do something with response error
    return error.response.data;
  }
);

export default axiosInstance;

export const endpoints = {
  auth: {
    getCredentialFormAccessToken:
      "https://www.googleapis.com/oauth2/v1/userinfo?access_token=",
    checkNewUser: "api/auth/has-user/",
    login: "api/auth/login",
    register: "api/auth/register",
    verifyOtp: "api/auth/verify-otp",
    sendOtp: "api/auth/send-otp/",
    forgotPassword: "api/auth/forgot-password/",
    resetPassword: "api/auth/reset-password/",
    logout: "api/auth/logout",
    loginWithGoogle: "api/auth/login-google",
    checkVerifiedUser: "api/auth/verified-user/",
  },
  ipAddress: "https://ipinfo.io/json?token=",
  user: {
    current: "api/user/current",
    getUser: "api/user/",
    getUsers: "api/user",
    bookmark_unbookmark: "api/user/bookmark-unbookmark/",
    update_user_profile: "api/user",
    update_avatar: "api/user/update-avatar",
    follow_unfollow: "api/user/follow-unfollow/",
    block_unblock_account: "api/user/block-account/",
  },
  posts: {
    getPosts: "api/post/feed",
    getUserPosts: "api/post/user-post/",
    getPost: "api/post/",
    createPost: "api/post",
    uploadFiles: "api/post/upload-files/",
    deletePost: "api/post/",
    updatePost: "api/post/",
    like_unlike: "api/post/like-unlike/",
    create_comment: "api/post/create-comment/",
    update_comment: "api/post/update-comment/",
    delete_comment: "api/post/delete-comment/",
    like_unlike_comment: "api/post/like-unlike-comment/",
  },
  activities: {
    getActivities: "api/activity",
    unreadCount: "api/activity/unread-count",
    markAsRead: "api/activity/mark-as-read",
  },
  comments: {
    comment: "api/comment/",
    likeUnlike: "api/comment/like-unlike/",
  },
  conversations: {
    getConversations: "api/conversation",
    getConversation: "api/conversation/",
  },
  messages: {
    sendMessage: "api/message/",
    sendMedias: "api/message/media/",
    sendAudio: "api/message/audio/",
    sendDocument: "api/message/document/",
    sendGiphy: "api/message/giphy/",
    getMessages: "api/message/",
    markAsRead: "api/message/mark-as-read",
  },
  activity_log: "api/activity-log",
};
