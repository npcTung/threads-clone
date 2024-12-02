import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createPost, deletePost, likeUnlikePost, updatePost } from "./actions";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import useAppStore from "@/zustand/useAppStore";

// createPost
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  const { sortPost } = useAppStore();
  const { user_name } = useParams();

  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["posts"],
        predicate(query) {
          return (
            query.queryKey.includes(sortPost) ||
            query.queryKey.includes(user_name)
          );
        },
      };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData) => {
        const firstPage = oldData?.pages[0];
        if (firstPage)
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                posts: [newPost, ...firstPage.posts],
                nextCursor: firstPage.nextCursor,
              },
              ...oldData.pages.slice(1),
            ],
          };
      });

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast.success("Bài viết của bạn đã được tạo thành công.");
    },
    onError(error) {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};
// deletePost
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient();
  const { sortPost } = useAppStore();
  const { user_name } = useParams();

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter = {
        queryKey: ["posts"],
        predicate(query) {
          return (
            query.queryKey.includes(sortPost) ||
            query.queryKey.includes(user_name)
          );
        },
      };

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData(queryFilter, (oldData) => {
        if (!oldData) return;

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => ({
            posts: page.posts.filter((post) => post._id !== deletedPost._id),
            nextCursor: page.nextCursor,
          })),
        };
      });

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast.success("Xóa bài viết thành công.");
    },
    onError(error) {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};
// updatePost
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient();
  const { sortPost } = useAppStore();
  const { user_name } = useParams();

  const mutation = useMutation({
    mutationFn: updatePost,
    onSuccess: async (updatedPost) => {
      const queryFilter = {
        queryKey: ["posts"],
        predicate(query) {
          return (
            query.queryKey.includes(sortPost) ||
            query.queryKey.includes(user_name)
          );
        },
      };
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData(queryFilter, (oldData) => {
        if (!oldData) return;

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => {
            return {
              posts: page.posts.map((post) =>
                post._id === updatedPost._id ? updatedPost : post
              ),
              nextCursor: page.nextCursor,
            };
          }),
        };
      });

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });
      queryClient.invalidateQueries({ queryKey: ["detail-post"] });

      toast.success("Cập nhật bài viết thành công.");
    },
    onError(error) {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};
// like/unlike post
export const useLikePostMutation = () => {
  const queryClient = useQueryClient();
  const { sortPost } = useAppStore();
  const { user_name } = useParams();

  const mutation = useMutation({
    mutationFn: likeUnlikePost,
    onSuccess: async (likePost) => {
      const queryFilter = {
        queryKey: ["posts"],
        predicate(query) {
          return (
            query.queryKey.includes(sortPost) ||
            query.queryKey.includes(user_name)
          );
        },
      };
      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData(queryFilter, (oldData) => {
        if (!oldData) return;

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => {
            return {
              posts: page.posts.map((post) =>
                post._id === likePost._id ? likePost : post
              ),
              nextCursor: page.nextCursor,
            };
          }),
        };
      });

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });
      queryClient.invalidateQueries({ queryKey: ["detail-post"] });
    },
    onError(error) {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};
