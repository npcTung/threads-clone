import axiosConfig, { endpoints } from "@/lib/axiosConfig";

export const sendMessage = (recipientId, data) =>
  axiosConfig({
    url: endpoints.messages.sendMessage + recipientId,
    method: "POST",
    data,
  });

export const sendMedias = (recipientId, data) =>
  axiosConfig({
    url: endpoints.messages.sendMedias + recipientId,
    method: "POST",
    data,
  });

export const sendAudio = (recipientId, data) =>
  axiosConfig({
    url: endpoints.messages.sendAudio + recipientId,
    method: "POST",
    data,
  });

export const sendDocument = (recipientId, data) =>
  axiosConfig({
    url: endpoints.messages.sendDocument + recipientId,
    method: "POST",
    data,
  });

export const sendGiphy = (recipientId, data) =>
  axiosConfig({
    url: endpoints.messages.sendGiphy + recipientId,
    method: "POST",
    data,
  });

export const getAllMessages = (conversationId, params) =>
  axiosConfig({
    url: endpoints.messages.getMessages + conversationId,
    method: "GET",
    params,
  });

export const markAsReadMessage = () =>
  axiosConfig({
    url: endpoints.messages.markAsRead,
    method: "PUT",
  });
