import axiosConfig, { endpoints } from "@/lib/axiosConfig";

export const getCurrent = () =>
  axiosConfig({
    url: endpoints.user.current,
    method: "GET",
  });

export const getUser = (userName) =>
  axiosConfig({
    url: endpoints.user.getUser + userName,
    method: "GET",
  });

export const getUsers = (params) =>
  axiosConfig({
    url: endpoints.user.getUsers,
    method: "GET",
    params,
  });

export const bookmark_unbookmark = (postId) =>
  axiosConfig({
    url: endpoints.user.bookmark_unbookmark + postId,
    method: "PUT",
  });

export const updateUserProfile = (data) =>
  axiosConfig({
    url: endpoints.user.update_user_profile,
    method: "PUT",
    data,
  });

export const updateAvatar = (data) =>
  axiosConfig({
    url: endpoints.user.update_avatar,
    method: "PUT",
    data,
  });

export const followUser = (userId) =>
  axiosConfig({
    url: endpoints.user.follow_unfollow + userId,
    method: "PUT",
  });

export const blockAccount = (uid) =>
  axiosConfig({
    url: endpoints.user.block_unblock_account + uid,
    method: "PUT",
  });
