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
    return Promise.reject(error);
  }
);

export default axiosInstance;

export const endpoints = {
  auth: {
    getCredentialFormAccessToken:
      "https://www.googleapis.com/oauth2/v1/userinfo?access_token=",
    checkNewUser: "auth/has-user/",
    login: "auth/login",
    register: "auth/register",
    verifyOtp: "auth/verify-otp",
    sendOtp: "auth/send-otp/",
    forgotPassword: "auth/forgot-password/",
    resetPassword: "auth/reset-password/",
    logout: "auth/logout",
    loginWithGoogle: "auth/login-google",
    checkVerifiedUser: "auth/verified-user/",
  },
  ipAddress: "https://ipinfo.io/json?token=",
  user: {
    current: "user/current",
    getUser: "user/",
    getUsers: "user",
    bookmark_unbookmark: "user/bookmark-unbookmark/",
    update_user_profile: "user",
    update_avatar: "user/update-avatar",
    follow_unfollow: "user/follow-unfollow/",
  },
  posts: {
    getPosts: "post/feed",
    getUserPosts: "post/user-post/",
    getPost: "post/",
    createPost: "post",
    uploadFiles: "post/upload-files/",
    deletePost: "post/",
    updatePost: "post/",
    like_unlike: "post/like-unlike/",
    create_comment: "post/create-comment/",
    update_comment: "post/update-comment/",
    delete_comment: "post/delete-comment/",
    like_unlike_comment: "post/like-unlike-comment/",
  },
};
