import axiosConfig, { endpoints } from "@/lib/axiosConfig";

export const getAllComments = (postId, params) =>
  axiosConfig({
    url: endpoints.comments.comment + postId,
    method: "GET",
    params,
  });

export const createComment = (postId, data) =>
  axiosConfig({
    url: endpoints.comments.comment + postId,
    method: "POST",
    data,
  });

export const updateComment = (cid, data) =>
  axiosConfig({
    url: endpoints.comments.comment + cid,
    method: "PUT",
    data,
  });

export const deleteComment = (cid) =>
  axiosConfig({
    url: endpoints.comments.comment + cid,
    method: "DELETE",
  });

export const likeComment = (cid) =>
  axiosConfig({
    url: endpoints.comments.likeUnlike + cid,
    method: "PUT",
  });
