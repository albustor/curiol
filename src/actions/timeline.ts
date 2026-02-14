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
    orderBy,
    getDocFromCache // Added to optimize if needed, though getDoc is fine
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

export async function removeTimelineEventById(timelineId: string, eventId: string): Promise<boolean> {
    try {
        const docRef = doc(db, COLLECTION_NAME, timelineId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return false;

        const data = docSnap.data();
        const events = data.events || [];
        const newEvents = events.filter((e: any) => e.id !== eventId);

        if (events.length === newEvents.length) return true; // Nothing to remove

        await updateDoc(docRef, {
            events: newEvents,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error removing timeline event:", error);
        return false;
    }
}

export async function removeTimelineEventByMediaUrl(timelineId: string, mediaUrl: string): Promise<boolean> {
    try {
        const docRef = doc(db, COLLECTION_NAME, timelineId);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return false;

        const data = docSnap.data();
        const events = data.events || [];
        const newEvents = events.filter((e: any) => e.mediaUrl !== mediaUrl);

        if (events.length === newEvents.length) return true;

        await updateDoc(docRef, {
            events: newEvents,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error removing timeline event by URL:", error);
        return false;
    }
}

export async function getClientTimeline(clientId: string): Promise<EvolutiveTimeline | null> {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where("clientId", "==", clientId),
            where("status", "==", "active"),
            orderBy("createdAt", "asc") // Get the first one created as primary
        );
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
