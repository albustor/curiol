
"use client";

import { useEffect, useState } from "react";
import { getAlbums } from "@/actions/portfolio";

export default function DebugPage() {
    const [status, setStatus] = useState("Checking...");
    const [albums, setAlbums] = useState<any[]>([]);
    const [envCheck, setEnvCheck] = useState<any>({});

    useEffect(() => {
        async function runCheck() {
            try {
                // Check public env variables (safe to check presence)
                setEnvCheck({
                    FIREBASE_API_KEY: !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                    FIREBASE_PROJECT_ID: !!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                    FIREBASE_APP_ID: !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
                });

                const data = await getAlbums();
                setAlbums(data);
                setStatus("Complete");
            } catch (err: any) {
                setStatus("Error: " + err.message);
            }
        }
        runCheck();
    }, []);

    return (
        <div style={{ padding: '40px', background: '#0a0a0a', color: 'white', fontFamily: 'monospace' }}>
            <h1>Curiol Studio Debug Info</h1>
            <p>Status: {status}</p>
            <p>Albums Found: {albums.length}</p>

            <h3>Environment Check (Vercel):</h3>
            <ul>
                {Object.entries(envCheck).map(([k, v]) => (
                    <li key={k}>{k}: {v ? "✅ SET" : "❌ MISSING"}</li>
                ))}
            </ul>

            <hr />
            <h3>Data Samples:</h3>
            {albums.map(a => (
                <div key={a.id} style={{ border: '1px solid #333', padding: '10px', margin: '10px 0' }}>
                    Title: {a.title} <br />
                    Category: {a.category} <br />
                    Photos: {a.photos?.length || 0} <br />
                    Cover: {a.coverUrl ? "✅ present" : "❌ missing"}
                </div>
            ))}

            <hr />
            <h3>Branding Check:</h3>
            <p>Target Branding: <b>Crecimiento Comercial & IA</b></p>
        </div>
    );
}
