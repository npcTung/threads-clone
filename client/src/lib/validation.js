import { z } from "zod";

const requiredString = z
  .string()
  .trim()
  .min(1, "Trường này không được để trống.");

export const updateUserProfileSchema = z.object({
  displayName: requiredString,
  bio: z.string().max(1000, "Phải có tối đa 1000 ký tự."),
  gender: requiredString,
  link: requiredString,
});

export const loginSchema = z.object({
  userName: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "Chỉ cho phép chữ cái, số và _."
  ),
  password: requiredString.min(8, "Phải có ít nhất 8 ký tự."),
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