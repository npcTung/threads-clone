import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
import { vi } from "date-fns/locale";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(form) {
  const currentDate = new Date();
  const relativeDate = new Date(form);
  if (currentDate.getTime() - relativeDate.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(relativeDate, {
      addSuffix: true,
      locale: vi,
    });
  } else {
    if (currentDate.getFullYear() === relativeDate.getFullYear()) {
      return formatDate(relativeDate, "d MMM", { locale: vi });
    } else {
      return formatDate(relativeDate, "d MMM, yyy", { locale: vi });
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

export const setTitle = (title = "Trang chủ") =>
  (document.title = `${title} • Threads`);

export const extractLinks = (inputString) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const linksArray = [];
  const modifiedString = inputString.replace(urlRegex, (url) => {
    const urlObject = new URL(url);
    const href = urlObject.href;
    linksArray.push(url);
    return `<a href="${url}" target="_blank" class="underline line-clamp-1">${href}</a>`;
  });
  return {
    originalString: modifiedString,
    links: linksArray,
  };
};
