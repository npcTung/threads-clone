import * as apis from "@/apis";

// create comment
export const createComment = async (postId, data) => {
  try {
    const response = await apis.createComment(postId, data);
    if (response.success) return response;
  } catch (error) {
    console.error(error.message);
  }
};
// get all comments
export const getAllCommentsPost = async (postId, cursor) => {
  try {
    const objectQueries = { cursor };
    const response = await apis.getAllComments(postId, objectQueries);
    return {
      comments: response.data,
      nextCursor: response.nextCursor,
    };
  } catch (error) {
    console.error(error.message);
  }
};
// delete comment
export const deleteComment = async (cid) => {
  try {
    const response = await apis.deleteComment(cid);
    if (response.success) return response;
  } catch (error) {
    console.error(error.message);
  }
};
// like/unlike comment
export const likeComment = async (cid) => {
  try {
    const response = await apis.likeComment(cid);
    if (response.success) return response.data;
  } catch (error) {
    console.error(error.message);
  }
};
