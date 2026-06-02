import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Primary class merging utility — used by all shadcn components
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
