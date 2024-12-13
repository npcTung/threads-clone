import * as apis from "@/apis";

export const sendMessage = async (data) => {
  const { recipientId, ...payload } = data;
  const response = await apis.sendMessage(recipientId, payload);
  return response.data;
};

export const getIpAddress = async () => {
  const response = await apis.ipAddress(import.meta.env.VITE_IP_TOKEN);
  return {
    city: response.data.city,
    country: response.data.country,
    postal: response.data.postal,
  };
};
