"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export interface QALog {
    testerName: string;
    featureName: string;
    navigation: number;      // 1-5
    interaction: number;     // 1-5
    responsiveness: number;  // 1-5
    visualConsistency: number; // 1-5
    clarity: number;         // 1-5
    performance: number;     // 1-5
    notes: string;
    blockers: string;
    status: "pass" | "fail" | "pending";
    createdAt: any;
}

export async function saveQALog(log: Omit<QALog, "createdAt">) {
    try {
        const docRef = await addDoc(collection(db, "qa_logs"), {
            ...log,
            createdAt: Timestamp.now()
        });
        return { success: true, id: docRef.id };
    } catch (error: any) {
        console.error("Error saving QA log:", error);
        return { success: false, error: error.message };
    }
}
