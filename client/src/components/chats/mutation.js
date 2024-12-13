import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  sendMessage,
  sendMessageAudio,
  sendMessageDocument,
  sendMessageGiphy,
  sendMessageMedias,
} from "./actions";
import useAppStore from "@/zustand/useAppStore";
import { toast } from "sonner";

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  const { conversation } = useAppStore();

  const mutation = useMutation({
    mutationFn: sendMessage,
    onSuccess: async (newMessage) => {
      const queryFilter = {
        queryKey: ["messages"],
        predicate(query) {
          return query.queryKey.includes(conversation._id);
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
                messages: [newMessage, ...firstPage.messages],
                nextCursor: firstPage.nextCursor,
              },
            ],
          };
      });

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });
    },
    onError(error) {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};

export const useSendMessageMediasMutation = () => {
  const queryClient = useQueryClient();
  const { conversation } = useAppStore();

  const mutation = useMutation({
    mutationFn: sendMessageMedias,
    onSuccess: async (newMessage) => {
      const queryFilter = {
        queryKey: ["messages"],
        predicate(query) {
          return query.queryKey.includes(conversation._id);
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
                messages: [newMessage, ...firstPage.messages],
                nextCursor: firstPage.nextCursor,
              },
            ],
          };
      });

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });
    },
    onError(error) {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};

export const useSendMessageDocumentMutation = () => {
  const queryClient = useQueryClient();
  const { conversation } = useAppStore();

  const mutation = useMutation({
    mutationFn: sendMessageDocument,
    onSuccess: async (newMessage) => {
      const queryFilter = {
        queryKey: ["messages"],
        predicate(query) {
          return query.queryKey.includes(conversation._id);
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
                messages: [newMessage, ...firstPage.messages],
                nextCursor: firstPage.nextCursor,
              },
            ],
          };
      });

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });
    },
    onError(error) {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};

export const useSendMessageAudioMutation = () => {
  const queryClient = useQueryClient();
  const { conversation } = useAppStore();

  const mutation = useMutation({
    mutationFn: sendMessageAudio,
    onSuccess: async (newMessage) => {
      const queryFilter = {
        queryKey: ["messages"],
        predicate(query) {
          return query.queryKey.includes(conversation._id);
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
                messages: [newMessage, ...firstPage.messages],
                nextCursor: firstPage.nextCursor,
              },
            ],
          };
      });

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });
    },
    onError(error) {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};

export const useSendMessageGiphyMutation = () => {
  const queryClient = useQueryClient();
  const { conversation } = useAppStore();

  const mutation = useMutation({
    mutationFn: sendMessageGiphy,
    onSuccess: async (newMessage) => {
      const queryFilter = {
        queryKey: ["messages"],
        predicate(query) {
          return query.queryKey.includes(conversation._id);
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
                messages: [newMessage, ...firstPage.messages],
                nextCursor: firstPage.nextCursor,
              },
            ],
          };
      });

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });
    },
    onError(error) {
      console.error(error);
      toast.error(error);
    },
  });

  return mutation;
};
