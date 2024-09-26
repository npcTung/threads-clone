import { endpoints } from "@/lib/axiosConfig";
import axios from "axios";

export const ipAddress = (tokenIp) =>
  axios({
    url: endpoints.ipAddress + tokenIp,
    method: "GET",
  });

export const getCredentialsFromAccessToken = (accessToken) =>
  axios({
    url: endpoints.auth.getCredentialFormAccessToken + accessToken,
    method: "GET",
  });
