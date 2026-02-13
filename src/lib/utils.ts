import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Converts a Google Drive sharing link to a direct download link
 * Optionally processes the image through the Curiol Optimization Engine
 */
export function getDirectImageUrl(url: string | undefined | null, optimize: boolean = false, format: 'webp' | 'jpg' = 'webp'): string {
    if (!url) return "";

    let directUrl = url;
    if (url.includes("drive.google.com")) {
        const idMatch = url.match(/\/d\/(.+?)\//) || url.match(/id=(.+?)(&|$)/);
        if (idMatch) {
            directUrl = `https://lh3.googleusercontent.com/u/0/d/${idMatch[1]}=s0`;
        }
    }

    if (optimize && directUrl) {
        return `/api/optimize?url=${encodeURIComponent(directUrl)}&w=2560&q=82&format=${format}`;
    }

    return directUrl;
}
