"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
    const router = useRouter();

    useEffect(() => {
        router.push("/admin/login");
    }, [router]);

    return (
        <div className="min-h-screen bg-tech-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-curiol-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
}
