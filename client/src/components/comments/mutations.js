import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createComment,
  deleteComment,
  likeComment,
  updateComment,
} from "./actions";
import { toast } from "sonner";

export const useCommentMutation = (postId) => {
  const queryClient = useQueryClient();

  const createCommentMutation = async (data) =>
    await createComment(postId, data);

  const mutation = useMutation({
    mutationFn: createCommentMutation,
    onSuccess: async (newComment) => {
      const queryFilter = {
        queryKey: ["comments"],
        predicate(query) {
          return query.queryKey.includes(postId);
        },
      };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData) => {
        const firstComment = oldData?.pages[0];

        if (firstComment)
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                comments: [newComment.data, ...firstComment.comments],
                nextCursor: firstComment.nextCursor,
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
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["detail-post"]);

      toast.success(newComment.mes);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};

export const useUpdateCommentMutation = (cid, postId) => {
  const queryClient = useQueryClient();

  const updateCommentMutation = async (data) => await updateComment(cid, data);

  const mutation = useMutation({
    mutationFn: updateCommentMutation,
    onSuccess: async (updatedComment) => {
      const queryFilter = {
        queryKey: ["comments"],
        predicate(query) {
          return query.queryKey.includes(postId);
        },
      };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData) => {
        if (!oldData) return;

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => {
            return {
              comments: page.comments.map((comment) =>
                comment._id === updatedComment.data._id
                  ? updatedComment.data
                  : comment
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

      toast.success(updatedComment.mes);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};

export const useDeleteCommentMutation = (postId) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryFilter = {
        queryKey: ["comments"],
        predicate(query) {
          return query.queryKey.includes(postId);
        },
      };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData) => {
        if (!oldData) return;

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => {
            return {
              comments: page.comments.filter(
                (comment) => comment._id !== deletedComment.data._id
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
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["detail-post"]);

      toast.success(deletedComment.mes);
    },
    onError: (error) => {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};

export const useLikeCommentMutation = (postId) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: likeComment,
    onSuccess: async (likedComment) => {
      const queryFilter = {
        queryKey: ["comments"],
        predicate(query) {
          return query.queryKey.includes(postId);
        },
      };
      await queryClient.cancelQueries(queryFilter);
      queryClient.setQueriesData(queryFilter, (oldData) => {
        if (!oldData) return;

        return {
          pageParams: oldData.pageParams,
          pages: oldData.pages.map((page) => {
            return {
              comments: page.comments.map((comment) =>
                comment._id === likedComment._id ? likedComment : comment
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
    },
  });

  return mutation;
};
