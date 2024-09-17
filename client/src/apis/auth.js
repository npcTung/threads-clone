import axiosConfig from "@/lib/axiosConfig";

export const register = (data) =>
  axiosConfig({
    url: "auth/register",
    method: "POST",
    data,
  });

export const verifyOtp = (data) =>
  axiosConfig({
    url: "auth/verify-otp",
    method: "PUT",
    data,
  });

export const login = (data) =>
  axiosConfig({
    url: "auth/login",
    method: "POST",
    data,
  });

export const sendOtp = (data) =>
  axiosConfig({
    url: "auth/send-otp",
    method: "PUT",
    data,
  });

export const forgotPassword = (data) =>
  axiosConfig({
    url: "auth/forgot-password",
    method: "PUT",
    data,
  });

export const resetPassword = (data) =>
  axiosConfig({
    url: "auth/reset-password",
    method: "PUT",
    data,
  });

export const logout = () =>
  axiosConfig({
    url: "auth/logout",
    method: "GET",
  });
