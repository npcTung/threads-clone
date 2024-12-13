import axiosConfig, { endpoints } from "@/lib/axiosConfig";

export const getActivityLogs = (params) =>
  axiosConfig({
    url: endpoints.activity_log,
    method: "GET",
    params,
  });
