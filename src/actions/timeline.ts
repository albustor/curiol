"use server";

import { db } from "@/lib/firebase";
import {
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    where,
    addDoc,
    updateDoc,
    serverTimestamp,
    arrayUnion,
    orderBy
} from "firebase/firestore";
import { EvolutiveTimeline, TimelineEvent, TimelineTheme } from "@/types/timeline";

const COLLECTION_NAME = "evolutive_timelines";

export async function getTimelines(): Promise<EvolutiveTimeline[]> {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("updatedAt", "desc"));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            } as EvolutiveTimeline;
        });
    } catch (error) {
        console.error("Error fetching timelines:", error);
        return [];
    }
}

export async function getTimelineById(id: string): Promise<EvolutiveTimeline | null> {
    try {
        const docRef = doc(db, COLLECTION_NAME, id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return null;

        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as EvolutiveTimeline;
    } catch (error) {
        console.error("Error fetching timeline by ID:", error);
        return null;
    }
}

export async function createTimeline(clientId: string, clientName: string): Promise<string | null> {
    try {
        const newTimeline: Partial<EvolutiveTimeline> = {
            clientId,
            clientName,
            createdAt: serverTimestamp() as any,
            updatedAt: serverTimestamp() as any,
            events: [],
            theme: 'classic',
            status: 'active'
        };
        const docRef = await addDoc(collection(db, COLLECTION_NAME), newTimeline);
        return docRef.id;
    } catch (error) {
        console.error("Error creating timeline:", error);
        return null;
    }
}

export async function addTimelineEvent(timelineId: string, event: Omit<TimelineEvent, 'id'>): Promise<boolean> {
    try {
        const docRef = doc(db, COLLECTION_NAME, timelineId);
        const eventWithId = {
            ...event,
            id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
        };
        await updateDoc(docRef, {
            events: arrayUnion(eventWithId),
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error adding timeline event:", error);
        return false;
    }
}

export async function updateTimelineTheme(timelineId: string, theme: TimelineTheme): Promise<boolean> {
    try {
        const docRef = doc(db, COLLECTION_NAME, timelineId);
        await updateDoc(docRef, {
            theme,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error updating timeline theme:", error);
        return false;
    }
}

export async function getClientTimeline(clientId: string): Promise<EvolutiveTimeline | null> {
    try {
        const q = query(collection(db, COLLECTION_NAME), where("clientId", "==", clientId));
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;

        const docSnap = snapshot.docs[0];
        const data = docSnap.data();
        return {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as EvolutiveTimeline;
    } catch (error) {
        console.error("Error fetching client timeline:", error);
        return null;
    }
}
