import { create } from "zustand";
import * as apis from "@/apis";
import { toast } from "sonner";

const usePostsStore = create((set, get) => ({
  userPosts: [],
  postFeeds: [],
  nextCursor: null,
  post: null,
  sortPost: "Threads",
  isLoading: false,
  isCreateLoading: false,
  setSortPost: (sortPost) => set({ sortPost }),
  setIsCreateLoading: (isCreateLoading) => set({ isCreateLoading }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setUserPosts: (userPosts) => set({ userPosts }),
  setPostFeeds: (postFeeds) => set({ postFeeds }),
  setNextCursor: (nextCursor) => set({ nextCursor }),
  setPost: (post) => set({ post }),
  clearPostData: () =>
    set({
      userPosts: [],
      postFeeds: [],
      post: null,
      isLoading: false,
      isCreateLoading: false,
      sortPost: "Threads",
      nextCursor: null,
    }),
  getUserPosts: async (userName) => {
    try {
      set({ isLoading: true });
      const userPosts = await apis.getUserPosts(userName);
      if (userPosts.success) set({ userPosts: userPosts.data });
    } catch (error) {
      set({ userPosts: [] });
      console.error(error.response.data.mes);
    } finally {
      set({ isLoading: false });
    }
  },
  getFeedPosts: async (cursor) => {
    try {
      set({ isLoading: true });
      const objectQueries = {};
      // if (cursor) objectQueries.cursor = cursor;
      if (get().sortPost === "Đang theo dõi") objectQueries.follower = true;
      else if (get().sortPost === "Đã thích") objectQueries.likes = true;
      else if (get().sortPost === "Đã lưu") objectQueries.bookmarks = true;
      else {
        delete objectQueries.follower;
        delete objectQueries.likes;
        delete objectQueries.bookmarks;
      }

      const postFeeds = await apis.getFeedPosts(objectQueries);
      if (postFeeds.success) {
        set({ postFeeds: postFeeds.data });
        set({ nextCursor: postFeeds.nextCursor });
      }
    } catch (error) {
      console.error(error.response.data.mes);
      set({ postFeeds: [] });
    } finally {
      set({ isLoading: false });
    }
  },
  getPost: async (postId) => {
    try {
      set({ isLoading: true });
      const post = await apis.getPost(postId);
      if (post.success) set({ post: post.data });
    } catch (error) {
      console.error(error.response.data.mes);
      set({ post: null });
    } finally {
      set({ isLoading: false });
    }
  },
  createPost: async (data) => {
    try {
      set({ isCreateLoading: true });
      const { files, ...payload } = data;
      const newPostItems = [...get().postFeeds];
      const newUserItems = [...get().userPosts];

      const createPost = await apis.createPost(payload);
      if (createPost.success) {
        if (newPostItems.length) newPostItems.unshift(createPost.data);
        else if (newUserItems.length) newUserItems.unshift(createPost.data);
        toast.success(createPost.mes);
      }
      if (files.length) {
        const formData = new FormData();
        for (let file of files) formData.append("filePosts", file);
        const uploadFiles = await apis.uploadFiles(
          formData,
          createPost.data._id
        );
        if (uploadFiles.success) {
          if (newPostItems.length)
            newPostItems.forEach((post, idx) => {
              if (post._id === uploadFiles.data._id)
                newPostItems[idx] = uploadFiles.data;
            });
          else if (newUserItems.length)
            newUserItems.forEach((post, idx) => {
              if (post._id === uploadFiles.data._id)
                newUserItems[idx] = uploadFiles.data;
            });

          toast.success(uploadFiles.mes);
        }
      }
      set({ postFeeds: newPostItems });
      set({ userPosts: newUserItems });
    } catch (error) {
      console.error(error.response.data.mes);
    } finally {
      set({ isCreateLoading: false });
    }
  },
  deletePost: async (postId) => {
    try {
      set({ isCreateLoading: true });
      const deletePost = await apis.deletePost(postId);
      if (deletePost.success) {
        set((state) => ({
          postFeeds: state.postFeeds.filter((post) => post._id !== postId),
        }));
        set((state) => ({
          userPosts: state.userPosts.filter((post) => post._id !== postId),
        }));
        toast.success(deletePost.mes);
      }
    } catch (error) {
      console.error(error.response.data.mes);
    } finally {
      set({ isCreateLoading: false });
    }
  },
  updatePost: async (postId, data) => {
    try {
      set({ isCreateLoading: true });
      const { files, ...payload } = data;
      const newPostItems = [...get().postFeeds];
      const newUserItems = [...get().userPosts];
      let newPost = get().post;

      const updatePost = await apis.updatePost(postId, payload);
      if (updatePost.success) {
        if (newPostItems.length)
          newPostItems.forEach((post, idx) => {
            if (post._id === updatePost.data._id)
              newPostItems[idx] = updatePost.data;
          });
        if (newUserItems.length)
          newUserItems.forEach((post, idx) => {
            if (post._id === updatePost.data._id)
              newUserItems[idx] = updatePost.data;
          });
        if (newPost) newPost = updatePost.data;
        toast.success(updatePost.mes);
      }
      if (files.length) {
        const formData = new FormData();
        for (let file of files) formData.append("filePosts", file);
        const uploadFiles = await apis.uploadFiles(
          formData,
          updatePost.data._id
        );
        if (uploadFiles.success) {
          if (newPostItems.length)
            newPostItems.forEach((post, idx) => {
              if (post._id === uploadFiles.data._id)
                newPostItems[idx] = uploadFiles.data;
            });
          if (newUserItems.length)
            newUserItems.forEach((post, idx) => {
              if (post._id === postId) newUserItems[idx] = uploadFiles.data;
            });
          if (newPost) newPost = uploadFiles.data;
          toast.success(uploadFiles.mes);
        }
      }
      set({ postFeeds: newPostItems });
      set({ userPosts: newUserItems });
      set({ post: newPost });
    } catch (error) {
      console.error(error.response.data.mes);
    } finally {
      set({ isCreateLoading: false });
    }
  },
  like_unlike: async (postId) => {
    try {
      const newPostItems = [...get().postFeeds];
      const newUserItems = [...get().userPosts];
      let newPost = get().post;

      const likePost = await apis.likePost(postId);
      if (likePost.success) {
        if (newPostItems.length)
          newPostItems.forEach((post, idx) => {
            if (post._id === likePost.data._id)
              newPostItems[idx] = likePost.data;
          });
        if (newUserItems.length)
          newUserItems.forEach((post, idx) => {
            if (post._id === likePost.data._id)
              newUserItems[idx] = likePost.data;
          });
        if (newPost) newPost = likePost.data;
      }

      set({ postFeeds: newPostItems });
      set({ userPosts: newUserItems });
      set({ post: newPost });
    } catch (error) {
      console.error(error.response.data.mes);
    }
  },
  createCommentPost: async (postId, data) => {
    try {
      set({ isCreateLoading: true });
      const newPostItems = [...get().postFeeds];
      const newUserItems = [...get().userPosts];
      let newPost = get().post;

      const createComment = await apis.createCommentPost(postId, data);
      if (createComment.success) {
        if (newPostItems.length)
          newPostItems.forEach((post, idx) => {
            if (post._id === createComment.data._id)
              newPostItems[idx] = createComment.data;
          });
        if (newUserItems.length)
          newUserItems.forEach((post, idx) => {
            if (post._id === createComment.data._id)
              newUserItems[idx] = createComment.data;
          });
        if (newPost) newPost = createComment.data;
        toast.success(createComment.mes);
      }

      set({ postFeeds: newPostItems });
      set({ userPosts: newUserItems });
      set({ post: newPost });
    } catch (error) {
      console.error(error.response.data.mes);
    } finally {
      set({ isCreateLoading: false });
    }
  },
  updateCommentPost: async (postId, commentId, data) => {
    try {
      set({ isCreateLoading: true });
      const newPostItems = [...get().postFeeds];
      const newUserItems = [...get().userPosts];
      let newPost = get().post;

      const updateComment = await apis.updateCommentPost(
        postId,
        commentId,
        data
      );
      if (updateComment.success) {
        if (newPostItems.length)
          newPostItems.forEach((post, idx) => {
            if (post._id === updateComment.data._id)
              newPostItems[idx] = updateComment.data;
          });
        if (newUserItems.length)
          newUserItems.forEach((post, idx) => {
            if (post._id === updateComment.data._id)
              newUserItems[idx] = updateComment.data;
          });
        if (newPost) newPost = updateComment.data;
        toast.success(updateComment.mes);
      }

      set({ postFeeds: newPostItems });
      set({ userPosts: newUserItems });
      set({ post: newPost });
    } catch (error) {
      console.error(error.response.data.mes);
    } finally {
      set({ isCreateLoading: false });
    }
  },
  deleteCommentPost: async (postId, commentId) => {
    try {
      set({ isCreateLoading: true });
      const newPostItems = [...get().postFeeds];
      const newUserItems = [...get().userPosts];
      let newPost = get().post;

      const deleteComment = await apis.deleteCommentPost(postId, commentId);
      if (deleteComment.success) {
        if (newPostItems.length)
          newPostItems.forEach((post, idx) => {
            if (post._id === deleteComment.data._id)
              newPostItems[idx] = deleteComment.data;
          });
        if (newUserItems.length)
          newUserItems.forEach((post, idx) => {
            if (post._id === deleteComment.data._id)
              newUserItems[idx] = deleteComment.data;
          });
        if (newPost) newPost = deleteComment.data;
        toast.success(deleteComment.mes);
      }

      set({ postFeeds: newPostItems });
      set({ userPosts: newUserItems });
      set({ post: newPost });
    } catch (error) {
      console.log(error.response.data.mes);
    } finally {
      set({ isCreateLoading: false });
    }
  },
  likeUnlikeCommentPost: async (postId, commentId) => {
    try {
      const newPostItems = [...get().postFeeds];
      const newUserItems = [...get().userPosts];
      let newPost = get().post;

      const like_unlike_comment = await apis.likeUnlikeCommentPost(
        postId,
        commentId
      );
      if (like_unlike_comment.success) {
        if (newPostItems.length)
          newPostItems.forEach((post, idx) => {
            if (post._id === like_unlike_comment.data._id)
              newPostItems[idx] = like_unlike_comment.data;
          });
        if (newUserItems.length)
          newUserItems.forEach((post, idx) => {
            if (post._id === like_unlike_comment.data._id)
              newUserItems[idx] = like_unlike_comment.data;
          });
        if (newPost) newPost = like_unlike_comment.data;
      }

      set({ postFeeds: newPostItems });
      set({ userPosts: newUserItems });
      set({ post: newPost });
    } catch (error) {
      console.error(error.response.data.mes);
    }
  },
}));

export default usePostsStore;
