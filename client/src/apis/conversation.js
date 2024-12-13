import axiosConfig, { endpoints } from "@/lib/axiosConfig";

export const getAllConversations = (params) =>
  axiosConfig({
    url: endpoints.conversations.getConversations,
    method: "GET",
    params,
  });

export const getConversation = (recipientId) =>
  axiosConfig({
    url: endpoints.conversations.getConversation + recipientId,
    method: "GET",
  });
