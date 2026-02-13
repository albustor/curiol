"use client";

import { useState, useEffect } from "react";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GlassCard } from "@/components/ui/GlassCard";
import {
    Camera, Music as MusicIcon, Sparkles, Upload, X, Check,
    Loader2, ArrowRight, ArrowLeft, Image as ImageIcon,
    Wand2, Play
} from "lucide-react";
import { generateDeliveryCopy } from "@/lib/gemini";

export default function NewDeliveryPage() {
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        service: "Esencia Familiar + AR",
        date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
        aiSong: "",
        aiSongUrl: "",
        btsVideoUrl: "",
        multimediaStory: "",
        arTrigger: "https://artivive.com",
    });
    const [isGeneratingAi, setIsGeneratingAi] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/admin/login");
                return;
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles(prev => [...prev, ...newFiles]);

            const urls = newFiles.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...urls]);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    const handleAiGenerate = async (type: "song_title" | "story") => {
        if (!formData.name) {
            alert("Por favor ingresa primero el nombre del cliente.");
            return;
        }
        setIsGeneratingAi(type);
        const result = await generateDeliveryCopy(formData.name, formData.service, type);
        if (type === "song_title") {
            const firstTitle = result.split('\n')[0].replace(/^\d+\.\s*/, '').trim();
            setFormData(prev => ({ ...prev, aiSong: firstTitle }));
        } else {
            setFormData(prev => ({ ...prev, multimediaStory: result }));
        }
        setIsGeneratingAi(null);
    };

    const handleCreateDelivery = async () => {
        setIsUploading(true);
        try {
            // 1. Upload Images to Storage
            const imageUrls = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const storageRef = ref(storage, `deliveries/${formData.slug}/${file.name}`);
                const uploadTask = uploadBytesResumable(storageRef, file);

                await new Promise((resolve, reject) => {
                    uploadTask.on('state_changed',
                        (snapshot) => {
                            const progress = ((snapshot.bytesTransferred / snapshot.totalBytes) + i) / files.length * 100;
                            setUploadProgress(progress);
                        },
                        (error) => reject(error),
                        () => resolve(true)
                    );
                });

                const url = await getDownloadURL(uploadTask.snapshot.ref);
                imageUrls.push(url);
            }

            // 2. Save to Firestore
            await addDoc(collection(db, "deliveries"), {
                ...formData,
                photos: imageUrls,
                createdAt: serverTimestamp(),
                active: true
            });

            router.push("/admin/dashboard");
        } catch (error) {
            console.error("Error creating delivery:", error);
            alert("Error al crear la entrega. Revisa la consola.");
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen flex flex-col pt-32 pb-24 bg-tech-950">
            <Navbar />
            <main className="flex-grow max-w-5xl mx-auto px-4 w-full">
                <header className="mb-12">
                    <button
                        onClick={() => step > 1 ? setStep(step - 1) : router.back()}
                        className="flex items-center gap-2 text-tech-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" /> Volver
                    </button>
                    <h1 className="text-4xl font-serif text-white italic mb-2">Nueva Entrega Digital</h1>
                    <p className="text-tech-500 text-sm italic">Paso {step} de 3</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Stepper Sidebar */}
                    <div className="hidden md:block space-y-4">
                        {[
                            { n: 1, label: "Información" },
                            { n: 2, label: "Galaría & Assets" },
                            { n: 3, label: "Memoria Viva" }
                        ].map((s) => (
                            <div key={s.n} className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${step === s.n ? 'bg-curiol-700/10 border-curiol-500 text-white' : 'bg-tech-900 border-tech-800 text-tech-500'}`}>
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${step === s.n ? 'bg-curiol-700' : 'bg-tech-800'}`}>{s.n}</span>
                                <span className="text-[10px] font-bold uppercase tracking-widest">{s.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Form Area */}
                    <div className="md:col-span-3">
                        <GlassCard className="p-8 border-tech-800">
                            {step === 1 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Camera className="w-6 h-6 text-curiol-500" />
                                        <h3 className="text-xl font-serif text-white italic">Datos del Cliente</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-tech-400 text-[10px] font-bold uppercase tracking-widest mb-2">Nombre Completo</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                                placeholder="Ej: Familia Bustos"
                                                className="w-full bg-tech-950 border border-tech-800 focus:border-curiol-500 outline-none p-4 rounded-xl text-white transition-all text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-tech-400 text-[10px] font-bold uppercase tracking-widest mb-2">Identificador (Slug)</label>
                                            <input
                                                type="text"
                                                value={formData.slug}
                                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                                placeholder="familia-bustos"
                                                className="w-full bg-tech-950 border border-tech-800 focus:border-curiol-500 outline-none p-4 rounded-xl text-tech-500 transition-all text-sm font-mono"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-tech-400 text-[10px] font-bold uppercase tracking-widest mb-2">Servicio Prestado</label>
                                            <select
                                                value={formData.service}
                                                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                                className="w-full bg-tech-950 border border-tech-800 focus:border-curiol-500 outline-none p-4 rounded-xl text-white transition-all text-sm appearance-none"
                                            >
                                                <option>Recuerdos Eternos (Fine Art)</option>
                                                <option>Aventura Mágica (IA)</option>
                                                <option>Relatos (Fine Art)</option>
                                                <option>Membresía Anual de Legado</option>
                                                <option>Omni Local/Pro (+Imagen)</option>
                                                <option>Gran Evento (Boda/15)</option>
                                                <option>Evento Institucional / Graduación</option>
                                                <option>Acción Deportiva (Surf/Golf)</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex items-center gap-3 mb-6">
                                        <ImageIcon className="w-6 h-6 text-curiol-500" />
                                        <h3 className="text-xl font-serif text-white italic">Carga de Fotografías</h3>
                                    </div>

                                    <div className="border-2 border-dashed border-tech-800 rounded-2xl p-12 text-center hover:border-curiol-500/50 transition-all group relative">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                        />
                                        <Upload className="w-12 h-12 text-tech-700 mx-auto mb-4 group-hover:text-curiol-500 transition-all" />
                                        <p className="text-white font-bold text-sm mb-2">Haz clic o arrastra las fotos aquí</p>
                                        <p className="text-tech-500 text-[10px] uppercase tracking-widest">Formatos JPG, PNG • Max 10MB por foto</p>
                                    </div>

                                    {previewUrls.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
                                            {previewUrls.map((url, i) => (
                                                <div key={i} className="relative aspect-[4/5] rounded-lg overflow-hidden border border-tech-800 group">
                                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                                    <button
                                                        onClick={() => removeFile(i)}
                                                        className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6 animate-fade-in">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Sparkles className="w-6 h-6 text-curiol-500" />
                                        <h3 className="text-xl font-serif text-white italic">Configuración de Memoria Viva</h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* AI Song Section */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-end">
                                                <label className="block text-tech-400 text-[10px] font-bold uppercase tracking-widest">Nombre del Himno Familiar (IA)</label>
                                                <button
                                                    onClick={() => handleAiGenerate("song_title")}
                                                    className="text-[8px] text-curiol-500 hover:text-white uppercase font-bold flex items-center gap-1 transition-all"
                                                >
                                                    {isGeneratingAi === "song_title" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                                    Sugerir con IA
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.aiSong}
                                                onChange={(e) => setFormData({ ...formData, aiSong: e.target.value })}
                                                placeholder="Ej: Resonancia Familiar"
                                                className="w-full bg-tech-950 border border-tech-800 focus:border-curiol-500 outline-none p-4 rounded-xl text-white transition-all text-sm"
                                            />
                                            <label className="block text-tech-400 text-[10px] font-bold uppercase tracking-widest">Link de Audio (Suno/Spotify/Hosting)</label>
                                            <input
                                                type="url"
                                                value={formData.aiSongUrl}
                                                onChange={(e) => setFormData({ ...formData, aiSongUrl: e.target.value })}
                                                placeholder="https://suno.com/song/..."
                                                className="w-full bg-tech-950 border border-tech-800 focus:border-curiol-500 outline-none p-4 rounded-xl text-white transition-all text-sm font-mono"
                                            />
                                        </div>

                                        {/* Video & AR Section */}
                                        <div className="space-y-4">
                                            <label className="block text-tech-400 text-[10px] font-bold uppercase tracking-widest">Link Video Behind the Scenes (BTS)</label>
                                            <input
                                                type="url"
                                                value={formData.btsVideoUrl}
                                                onChange={(e) => setFormData({ ...formData, btsVideoUrl: e.target.value })}
                                                placeholder="https://youtube.com/..."
                                                className="w-full bg-tech-950 border border-tech-800 focus:border-curiol-500 outline-none p-4 rounded-xl text-white transition-all text-sm font-mono"
                                            />
                                            <label className="block text-tech-400 text-[10px] font-bold uppercase tracking-widest">Link AR (Artivive/Awe.re)</label>
                                            <input
                                                type="url"
                                                value={formData.arTrigger}
                                                onChange={(e) => setFormData({ ...formData, arTrigger: e.target.value })}
                                                placeholder="https://artivive.com/view/..."
                                                className="w-full bg-tech-950 border border-tech-800 focus:border-curiol-500 outline-none p-4 rounded-xl text-white transition-all text-sm font-mono"
                                            />
                                        </div>

                                        {/* Multimedia Story */}
                                        <div className="md:col-span-2 space-y-4">
                                            <div className="flex justify-between items-end">
                                                <label className="block text-tech-400 text-[10px] font-bold uppercase tracking-widest">Historia Multimedia (Narrativa Emotiva)</label>
                                                <button
                                                    onClick={() => handleAiGenerate("story")}
                                                    className="text-[8px] text-curiol-500 hover:text-white uppercase font-bold flex items-center gap-1 transition-all"
                                                >
                                                    {isGeneratingAi === "story" ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                                                    Redactar con IA
                                                </button>
                                            </div>
                                            <textarea
                                                value={formData.multimediaStory}
                                                onChange={(e) => setFormData({ ...formData, multimediaStory: e.target.value })}
                                                placeholder="Cuéntanos la historia detrás de esta sesión..."
                                                rows={4}
                                                className="w-full bg-tech-950 border border-tech-800 focus:border-curiol-500 outline-none p-6 rounded-xl text-white transition-all text-sm resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="mt-12 flex justify-between items-center pt-8 border-t border-tech-800">
                                <p className="text-tech-600 text-[10px] uppercase font-bold tracking-widest">
                                    {files.length} archivos seleccionados
                                </p>
                                <div className="flex gap-4">
                                    {step < 3 ? (
                                        <button
                                            onClick={() => setStep(step + 1)}
                                            disabled={step === 1 && !formData.name}
                                            className="px-8 py-4 bg-tech-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-tech-800 transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            Siguiente <ArrowRight className="w-4 h-4" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleCreateDelivery}
                                            disabled={isUploading || files.length === 0}
                                            className="px-10 py-4 bg-curiol-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-curiol-500 transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Finalizar Entrega</>}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {isUploading && (
                                <div className="mt-8">
                                    <div className="w-full h-1.5 bg-tech-900 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-curiol-gradient transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                    <p className="text-center text-[8px] text-tech-500 uppercase font-bold tracking-widest mt-2">Subiendo activos... {Math.round(uploadProgress)}%</p>
                                </div>
                            )}
                        </GlassCard>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
