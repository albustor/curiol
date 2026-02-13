import { db } from "./firebase";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/google`;

/**
 * Generates the Google OAuth2 authorization URL
 */
export function getGoogleAuthUrl() {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const options = {
        redirect_uri: REDIRECT_URI,
        client_id: GOOGLE_CLIENT_ID!,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(' '),
    };

    const qs = new URLSearchParams(options);
    return `${rootUrl}?${qs.toString()}`;
}

/**
 * Exchanges the authorization code for access and refresh tokens
 */
export async function getTokensFromCode(code: string) {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
        code,
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams(values),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        if (!res.ok) throw new Error('Failed to fetch tokens');
        return await res.json();
    } catch (error) {
        console.error('Error exchanging code for tokens:', error);
        throw error;
    }
}

/**
 * Refreshes an expired access token
 */
export async function refreshAccessToken(refreshToken: string) {
    const url = 'https://oauth2.googleapis.com/token';
    const values = {
        client_id: GOOGLE_CLIENT_ID!,
        client_secret: GOOGLE_CLIENT_SECRET!,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
    };

    try {
        const res = await fetch(url, {
            method: 'POST',
            body: new URLSearchParams(values),
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        if (!res.ok) throw new Error('Failed to refresh token');
        return await res.json();
    } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
    }
}

/**
 * Saves tokens to Firestore in a secure admin collection
 */
export async function saveGoogleTokens(tokens: any) {
    const adminRef = doc(db, "admin_config", "google_oauth");
    await setDoc(adminRef, {
        ...tokens,
        updatedAt: Timestamp.now(),
    }, { merge: true });
}

/**
 * Retrieves tokens from Firestore
 */
export async function getGoogleTokens() {
    const adminRef = doc(db, "admin_config", "google_oauth");
    const docSnap = await getDoc(adminRef);
    if (!docSnap.exists()) return null;
    return docSnap.data();
}
