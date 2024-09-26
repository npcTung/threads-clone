import axiosConfig, { endpoints } from "@/lib/axiosConfig";

export const getUserPosts = (userName) =>
  axiosConfig({
    url: endpoints.posts.getUserPosts + userName,
    method: "GET",
  });

export const getFeedPosts = (params) =>
  axiosConfig({
    url: endpoints.posts.getPosts,
    method: "GET",
    params,
  });

export const getPost = (postId) =>
  axiosConfig({
    url: endpoints.posts.getPost + postId,
    method: "GET",
  });

export const createPost = (data) =>
  axiosConfig({
    url: endpoints.posts.createPost,
    method: "POST",
    data,
  });

export const uploadFiles = (data, postId) =>
  axiosConfig({
    url: endpoints.posts.uploadFiles + postId,
    method: "PUT",
    data,
  });

export const deletePost = (postId) =>
  axiosConfig({
    url: endpoints.posts.deletePost + postId,
    method: "DELETE",
  });

export const updatePost = (postId, data) =>
  axiosConfig({
    url: endpoints.posts.updatePost + postId,
    method: "PUT",
    data,
  });

export const likePost = (postId) =>
  axiosConfig({
    url: endpoints.posts.like_unlike + postId,
    method: "PUT",
  });

export const createCommentPost = (postId, data) =>
  axiosConfig({
    url: endpoints.posts.create_comment + postId,
    method: "POST",
    data,
  });

export const updateCommentPost = (postId, commentId, data) =>
  axiosConfig({
    url: endpoints.posts.update_comment + `${postId}/${commentId}`,
    method: "PUT",
    data,
  });

export const deleteCommentPost = (postId, commentId) =>
  axiosConfig({
    url: endpoints.posts.delete_comment + `${postId}/${commentId}`,
    method: "DELETE",
  });

export const likeUnlikeCommentPost = (postId, commentId) =>
  axiosConfig({
    url: endpoints.posts.like_unlike_comment + `${postId}/${commentId}`,
    method: "PUT",
  });
