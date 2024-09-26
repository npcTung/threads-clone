import axiosConfig, { endpoints } from "@/lib/axiosConfig";

export const checkNewUserFromEmail = (email) =>
  axiosConfig({
    url: endpoints.auth.checkNewUser + email,
    method: "GET",
  });

export const checkVerifiedUserFromUserName = (userName) =>
  axiosConfig({
    url: endpoints.auth.checkVerifiedUser + userName,
    method: "GET",
  });

export const register = (data) =>
  axiosConfig({
    url: endpoints.auth.register,
    method: "POST",
    data,
  });

export const verifyOtp = (data) =>
  axiosConfig({
    url: endpoints.auth.verifyOtp,
    method: "PUT",
    data,
  });

export const login = (data) =>
  axiosConfig({
    url: endpoints.auth.login,
    method: "POST",
    data,
  });

export const loginWithGoogle = (data) =>
  axiosConfig({
    url: endpoints.auth.loginWithGoogle,
    method: "POST",
    data,
  });

export const sendOtp = (email) =>
  axiosConfig({
    url: endpoints.auth.sendOtp + email,
    method: "PUT",
  });

export const forgotPassword = (email) =>
  axiosConfig({
    url: endpoints.auth.forgotPassword + email,
    method: "PUT",
  });

export const resetPassword = (data, email) =>
  axiosConfig({
    url: endpoints.auth.resetPassword + email,
    method: "PUT",
    data,
  });

export const logout = () =>
  axiosConfig({
    url: endpoints.auth.logout,
    method: "GET",
  });
