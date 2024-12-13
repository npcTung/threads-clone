import * as apis from "@/apis";

export const getAllConversations = async (queriesDebounce, cursor) => {
  const queries = { ...queriesDebounce, cursor };
  const response = await apis.getAllConversations(queries);
  return {
    conversations: response.data,
    nextCursor: response.nextCursor,
  };
};

export const fetchMarkAsRead = async () => {
  const response = await apis.markAsReadMessage();
  if (response.success) {
    return response.success;
  } else {
    console.error(response.mes);
  }
};

export const getAllMessages = async (conversationId, cursor) => {
  const queries = { cursor };
  const response = await apis.getAllMessages(conversationId, queries);
  return {
    messages: response.data,
    nextCursor: response.nextCursor,
  };
};

export const sendMessage = async (data) => {
  const { recipientId, ...payload } = data;
  const response = await apis.sendMessage(recipientId, payload);
  return response.data;
};

export const sendMessageMedias = async (data) => {
  const { recipientId, images } = data;
  const formData = new FormData();
  for (let media of images) formData.append("medias", media);
  const response = await apis.sendMedias(recipientId, formData);
  return response.data;
};

export const sendMessageDocument = async (data) => {
  const { recipientId, document } = data;
  const formData = new FormData();
  formData.append("document", document);
  const response = await apis.sendDocument(recipientId, formData);
  return response.data;
};

export const sendMessageAudio = async (data) => {
  const { recipientId, audio } = data;
  const formData = new FormData();
  formData.append("audio", audio);
  const response = await apis.sendAudio(recipientId, formData);
  return response.data;
};

export const sendMessageGiphy = async (data) => {
  const { recipientId, ...payload } = data;
  const response = await apis.sendGiphy(recipientId, payload);
  return response.data;
};

export const getAllUsers = async (queries, cursor) => {
  const objectQueries = { ...queries, cursor };
  const response = await apis.getUsers(objectQueries);
  return {
    users: response.data,
    nextCursor: response.nextCursor,
  };
};
