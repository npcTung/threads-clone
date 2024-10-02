import axiosConfig, { endpoints } from "@/lib/axiosConfig";

export const getActivities = (params) =>
  axiosConfig({
    url: endpoints.activities.getActivities,
    method: "GET",
    params,
  });

export const unreadCount = () =>
  axiosConfig({
    url: endpoints.activities.unreadCount,
    method: "GET",
  });

export const markAsRead = () =>
  axiosConfig({
    url: endpoints.activities.markAsRead,
    method: "PUT",
  });
