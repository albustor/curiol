export type TimelineTheme = 'classic' | 'modern' | 'artistic' | 'cinematic';

export interface TimelineEvent {
    id: string;
    date: string; // ISO date
    title: string;
    description: string;
    mediaUrl: string; // URL to photo or video preview
    mediaType: 'image' | 'video';
    location?: string;
    tags?: string[];
    packageId?: string; // Reference to the package (Aventura, Recuerdos, etc.)
}

export interface EvolutiveTimeline {
    id: string;
    clientId: string;
    clientName: string;
    createdAt: string;
    updatedAt: string;
    events: TimelineEvent[];
    theme: TimelineTheme;
    youtubePlaylistId?: string;
    status: 'active' | 'archived' | 'hidden';
    coverImageUrl?: string;
}

export interface VideoGenerationRequest {
    id: string;
    timelineId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    requestedAt: string;
    completedAt?: string;
    youtubeUrl?: string;
    notes?: string;
}
