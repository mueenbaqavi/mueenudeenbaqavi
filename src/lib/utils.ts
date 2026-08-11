import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function absoluteUrl(path = "") {
  return new URL(path, "https://mueenudeenbaqavi.com").toString();
}

export function formatMalayalamDate(date: string | Date) {
  return new Intl.DateTimeFormat("ml-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}
