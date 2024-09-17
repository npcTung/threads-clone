import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(form) {
  const currentDate = new Date();
  if (currentDate.getTime() - form.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(form, { addSuffix: true, locale: vi });
  } else {
    if (currentDate.getFullYear() === form.getFullYear()) {
      return formatDate(form, "d MMM", { locale: vi });
    } else {
      return formatDate(form, "d MMM, yyy", { locale: vi });
    }
  }
}

export function formmatNumber(n) {
  return Intl.NumberFormat("vi-VN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(n);
}

export const convertFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};
