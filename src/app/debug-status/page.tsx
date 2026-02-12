
"use client";

import { useEffect, useState } from "react";
import { getAlbums } from "@/actions/portfolio";

export default function DebugPage() {
    const [status, setStatus] = useState("Checking...");
    const [env, setEnv] = useState<any>({});
    const [albumsCount, setAlbumsCount] = useState<number | null>(null);

    useEffect(() => {
        async function runCheck() {
            try {
                const albums = await getAlbums();
                setAlbumsCount(albums.length);
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
            <p>Portfolio Albums Found: {albumsCount}</p>
            <hr />
            <h3>Branding Check:</h3>
            <p>"Legado y Crecimiento Comercial" should be here -> <b>Legado y Crecimiento Comercial</b></p>
            <hr />
            <p>If you see "Arquitectura de Memorias" anywhere, the build is OLD.</p>
        </div>
    );
}
