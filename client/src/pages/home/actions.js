import * as apis from "@/apis";

export const getDetialPost = async (post_id) => {
  try {
    const response = await apis.getPost(post_id);
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

export const getFeedPosts = async (cursor, sortPost) => {
  const objectQueries = { cursor };
  if (sortPost === "Đang theo dõi") objectQueries.follower = true;
  else if (sortPost === "Đã thích") objectQueries.likes = true;
  else if (sortPost === "Đã lưu") objectQueries.bookmarks = true;
  else {
    delete objectQueries.follower;
    delete objectQueries.likes;
    delete objectQueries.bookmarks;
  }
  try {
    const response = await apis.getFeedPosts(objectQueries);
    if (response.success)
      return {
        posts: response.data,
        nextCursor: response.nextCursor,
      };
  } catch (error) {
    console.error(error.response.data.mes);
  }
};

export const fetchGetUsers = async (queries, cursor) => {
  const objectQueries = { ...queries, cursor };
  return await apis.getUsers(objectQueries);
};

export const fetchGetUserPosts = async (userName, cursor) => {
  try {
    const objectQueries = { cursor };
    const response = await apis.getUserPosts(userName, objectQueries);
    if (response.success)
      return {
        posts: response.data,
        nextCursor: response.nextCursor,
      };
  } catch (error) {
    console.error(error.message);
  }
};

export const fetchGetUser = async (userName) => {
  const response = await apis.getUser(userName);
  if (response.success) return response.data;
};

export const fetchActivities = async (cursor) => {
  try {
    const response = await apis.getActivities(cursor);
    if (response.success)
      return {
        activities: response.data,
        nextCursor: response.nextCursor,
      };
  } catch (error) {
    console.error(error.message);
  }
};

export const getConversation = async (recipientId) => {
  const response = await apis.getConversation(recipientId);
  if (response.success) return response.data;
};
