import axiosConfig from "@/lib/axiosConfig";

export const getCurrent = () =>
  axiosConfig({
    url: "user/current",
    method: "GET",
  });
