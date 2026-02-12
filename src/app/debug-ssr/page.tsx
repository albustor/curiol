
import { getAlbums } from "@/actions/portfolio";

export const dynamic = 'force-dynamic';

export default async function DebugSSRPage() {
    let albumsCount = 0;
    let error = null;
    let envCheck = {
        PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "✅ present" : "❌ missing",
    };

    try {
        const albums = await getAlbums();
        albumsCount = albums.length;
    } catch (err: any) {
        error = err.message;
    }

    return (
        <div style={{ padding: '40px', background: '#0a0a0a', color: 'white', fontFamily: 'monospace' }}>
            <h1>Curiol Studio SSR Debug</h1>
            <p>Project ID: {envCheck.PROJECT_ID}</p>
            <p>API Key Status: {envCheck.API_KEY}</p>
            <p>Albums Count (SSR): {albumsCount}</p>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            <hr />
            <p>If Count is 0 but Firestore has data, the server connection is failing.</p>
        </div>
    );
}
