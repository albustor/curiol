import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Converts a Google Drive sharing link to a direct download link
 */
export function getDirectImageUrl(url: string | undefined | null): string {
    if (!url) return "";
    if (url.includes("drive.google.com")) {
        const idMatch = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
        if (idMatch) {
            return `https://lh3.googleusercontent.com/u/0/d/${idMatch[1]}=w1000`;
        }
    }
    return url;
}
