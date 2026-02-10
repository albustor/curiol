"use client";

import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { User, onAuthStateChanged } from "firebase/auth";

export type UserRole = "MASTER" | "TEAM" | "UNAUTHORIZED" | "LOADING";

interface CustomUser {
    email: string | null;
    displayName: string | null;
    photoURL?: string | null;
}

export function useRole() {
    const [role, setRole] = useState<UserRole>("LOADING");
    const [user, setUser] = useState<User | CustomUser | null>(null);

    useEffect(() => {
        const MASTER_EMAILS = ["admin@curiol.studio", "info@curiol.studio"];
        const TEAM_EMAILS = ["kevin@curiol.studio", "cristina@curiol.studio"];

        // Master PIN always wins
        const isMasterPIN = typeof window !== "undefined" && localStorage.getItem("master_admin") === "true";

        if (isMasterPIN) {
            setRole("MASTER");
            setUser({ email: "admin@curiol.studio", displayName: "Master Alberto" });
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                setRole("UNAUTHORIZED");
                setUser(null);
                return;
            }

            const email = currentUser.email?.toLowerCase() || "";

            if (MASTER_EMAILS.includes(email)) {
                setRole("MASTER");
            } else if (TEAM_EMAILS.includes(email)) {
                setRole("TEAM");
            } else {
                setRole("UNAUTHORIZED");
            }

            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    return { role, user, isMaster: role === "MASTER", isTeam: role === "TEAM" };
}
