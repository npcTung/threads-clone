import * as apis from "@/apis";

// createPost
export const createPost = async (data) => {
  const { files, ...payload } = data;
  let post;
  const createPost = await apis.createPost(payload);
  if (createPost.success) post = createPost.data;
  if (files.length) {
    const formData = new FormData();
    for (let file of files) formData.append("filePosts", file);
    const uploadFiles = await apis.uploadFiles(formData, createPost.data._id);
    if (uploadFiles.success) post = uploadFiles.data;
  }

  return post;
};
// deletePost
export const deletePost = async (postId) => {
  const deletePost = await apis.deletePost(postId);
  if (deletePost.success) return deletePost.data;
};
// updatePost
export const updatePost = async (data) => {
  const { files, ...payload } = data.payload;
  let post;
  const updatePost = await apis.updatePost(data.postId, payload);
  if (updatePost.success) post = updatePost.data;
  if (files.length) {
    const formData = new FormData();
    for (let file of files) formData.append("filePosts", file);
    const uploadFiles = await apis.uploadFiles(formData, post._id);
    if (uploadFiles.success) post = uploadFiles.data;
  }

  return post;
};
// like/unlike post
export const likeUnlikePost = async (postId) => {
  const likeUnlikePost = await apis.likePost(postId);
  if (likeUnlikePost.success) return likeUnlikePost.data;
};
