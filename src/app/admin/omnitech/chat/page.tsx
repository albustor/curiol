"use client";

import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Send, User, MessageCircle,
    Instagram, Facebook, Search,
    Clock, Shield, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, limit, onSnapshot, addDoc, Timestamp, where } from "firebase/firestore";
import { sendWhatsAppMessage, sendSocialMessage } from "@/lib/meta";

interface ChatMessage {
    id: string;
    contactId: string;
    message: string;
    channel: "whatsapp" | "social";
    direction: "inbound" | "outbound";
    type?: string;
    timestamp: any;
}

interface Contact {
    id: string;
    lastMessage: string;
    timestamp: any;
    channel: string;
}

export default function LiveChatPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch Unique Contacts
    useEffect(() => {
        const q = query(collection(db, "omni_conversations"), orderBy("timestamp", "desc"), limit(100));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const seen = new Set();
            const uniqueContacts: Contact[] = [];
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                if (!seen.has(data.contactId)) {
                    seen.add(data.contactId);
                    uniqueContacts.push({
                        id: data.contactId,
                        lastMessage: data.message,
                        timestamp: data.timestamp,
                        channel: data.channel
                    });
                }
            });
            setContacts(uniqueContacts);
        });
        return () => unsubscribe();
    }, []);

    // Fetch Messages for Selected Contact
    useEffect(() => {
        if (!selectedContact) return;
        const q = query(
            collection(db, "omni_conversations"),
            where("contactId", "==", selectedContact),
            orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as ChatMessage[];
            setMessages(data);
            setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        });
        return () => unsubscribe();
    }, [selectedContact]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedContact) return;

        setLoading(true);
        const contact = contacts.find(c => c.id === selectedContact);
        const channel = contact?.channel || "whatsapp";

        try {
            // 1. Send via API
            if (channel === "whatsapp") {
                await sendWhatsAppMessage(selectedContact, newMessage);
            } else {
                // Need to detect if it's IG or FB from some metadata, defaulting for now
                await sendSocialMessage(selectedContact, newMessage, "instagram");
            }

            // 2. Log in Firestore
            await addDoc(collection(db, "omni_conversations"), {
                contactId: selectedContact,
                message: newMessage,
                channel: channel,
                direction: "outbound",
                type: "manual",
                timestamp: Timestamp.now()
            });

            setNewMessage("");
        } catch (error) {
            console.error("Error sending manual message:", error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-tech-950 flex flex-col pt-32 h-screen overflow-hidden">
            <Navbar />

            <main className="flex-grow max-w-[1600px] mx-auto w-full px-4 pb-8 flex gap-6 overflow-hidden">
                {/* Sidebar: Contact List */}
                <div className="w-80 flex flex-col gap-6 h-full overflow-hidden">
                    <header className="flex items-center gap-3">
                        <MessageCircle className="text-curiol-500 w-5 h-5" />
                        <h2 className="text-xl font-serif text-white italic">Conversaciones</h2>
                    </header>

                    <GlassCard className="flex-grow p-0 overflow-hidden flex flex-col">
                        <div className="p-4 border-b border-white/5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tech-700" />
                                <input
                                    placeholder="Buscar contacto..."
                                    className="w-full bg-tech-950 border border-tech-800 rounded-xl py-2 pl-10 pr-4 text-xs text-white outline-none focus:border-curiol-500"
                                />
                            </div>
                        </div>
                        <div className="flex-grow overflow-y-auto custom-scrollbar">
                            {contacts.map((contact) => (
                                <button
                                    key={contact.id}
                                    onClick={() => setSelectedContact(contact.id)}
                                    className={`w-full p-4 flex gap-4 transition-all border-l-2 ${selectedContact === contact.id ? "bg-curiol-500/10 border-curiol-500" : "border-transparent hover:bg-white/5"
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-tech-900 border border-white/5 flex items-center justify-center shrink-0">
                                        <User className="w-5 h-5 text-tech-500" />
                                    </div>
                                    <div className="text-left overflow-hidden">
                                        <p className="text-white text-sm font-bold truncate">{contact.id}</p>
                                        <p className="text-tech-500 text-[10px] truncate">{contact.lastMessage}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Main Chat Area */}
                <div className="flex-grow flex flex-col h-full overflow-hidden">
                    {selectedContact ? (
                        <>
                            <header className="mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-tech-900 border border-white/5 flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-curiol-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-serif text-white italic leading-none">{selectedContact}</h3>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-tech-500">En Línea • WhatsApp</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button className="px-4 py-2 bg-tech-900 border border-white/5 rounded-xl text-tech-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">Pausar IA</button>
                                    <button className="px-4 py-2 bg-tech-900 border border-white/5 rounded-xl text-tech-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">Cerrar Caso</button>
                                </div>
                            </header>

                            <GlassCard className="flex-grow p-6 overflow-hidden flex flex-col mb-6">
                                <div className="flex-grow overflow-y-auto pr-4 space-y-6 custom-scrollbar">
                                    {messages.map((msg, i) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.direction === 'inbound' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div className={`max-w-[70%] group`}>
                                                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.direction === 'inbound'
                                                        ? "bg-tech-900 text-white border border-white/5 rounded-tl-none"
                                                        : "bg-curiol-gradient text-white rounded-tr-none shadow-xl shadow-curiol-500/10"
                                                    }`}>
                                                    {msg.message}
                                                </div>
                                                <div className={`flex items-center gap-2 mt-2 ${msg.direction === 'inbound' ? 'justify-start' : 'justify-end'}`}>
                                                    {msg.type === 'ai_fallback' && <Sparkles className="w-3 h-3 text-tech-500" />}
                                                    <span className="text-[9px] font-bold text-tech-700 uppercase tracking-widest focus:opacity-100 opacity-0 group-hover:opacity-100 transition-all">
                                                        {msg.type === 'ai_fallback' ? 'IA AI' : msg.type === 'manual' ? 'Alberto' : 'Cliente'} • {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollRef} />
                                </div>

                                <form onSubmit={handleSendMessage} className="mt-6 flex gap-4">
                                    <input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Escribe un mensaje..."
                                        className="flex-grow bg-tech-950 border border-tech-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-curiol-500 transition-all"
                                    />
                                    <button
                                        disabled={loading || !newMessage.trim()}
                                        className="px-8 py-4 bg-curiol-gradient text-white rounded-2xl hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-curiol-500/20"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </form>
                            </GlassCard>
                        </>
                    ) : (
                        <div className="flex-grow flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <div className="w-20 h-20 bg-tech-900 border border-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                    <MessageCircle className="w-8 h-8 text-tech-700" />
                                </div>
                                <h3 className="text-2xl font-serif text-white italic">Centro de Control OmniFlow</h3>
                                <p className="text-tech-500 text-sm font-light max-w-xs mx-auto">Selecciona una conversación a la izquierda para monitorear o intervenir.</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
