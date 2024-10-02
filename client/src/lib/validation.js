import { z } from "zod";

const requiredString = z
  .string()
  .trim()
  .min(1, "Trường này không được để trống.");

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(200, "Phải có tối đa 200 ký tự."),
  gender: z.string(),
  link: z.string(),
});

export const loginSchema = z.object({
  userName: requiredString.regex(
    /^[a-zA-Z0-9_]+$/,
    "Chỉ cho phép chữ cái, số và _."
  ),
  password: requiredString.min(6, "Phải có ít nhất 6 ký tự."),
});

export const setPassword = z
  .object({
    userName: requiredString.regex(
      /^[a-zA-Z0-9_-]+$/,
      "Chỉ cho phép chữ cái, số và _."
    ),
    password: requiredString.max(8, "Phải có ít nhất 8 ký tự."),
    confirmPassword: requiredString.max(8, "Phải có ít nhất 8 ký tự."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu phải trùng khớp.",
  });

export const signUpSchema = z
  .object({
    email: requiredString.email("Địa chỉ email không hợp lệ."),
    userName: requiredString.regex(
      /^[a-zA-Z0-9_-]+$/,
      "Chỉ cho phép chữ cái, số và _."
    ),
    displayName: requiredString,
    password: requiredString.min(8, "Phải có ít nhất 8 ký tự."),
    confirmPassword: requiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu phải trùng khớp.",
  });

export const restPasswordSchema = z
  .object({
    otp: requiredString.max(6, "Không quá 6 ký tự."),
    password: requiredString.min(8, "Phải có ít nhất 8 ký tự."),
    confirmPassword: requiredString,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu phải trùng khớp.",
  });
