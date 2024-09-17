import axios from "axios";

export const ipAddress = () =>
  axios({
    url: `https://ipinfo.io/json?token=${import.meta.env.VITE_IP_TOKEN}`,
    method: "GET",
  });
